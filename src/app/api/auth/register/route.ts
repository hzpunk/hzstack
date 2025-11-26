import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateToken, setAuthCookie } from '@/lib/jwt'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rateLimit'

// Валидация входных данных
const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  phone: z.string().regex(/^\d{10}$/, 'Телефон должен содержать ровно 10 цифр'),
})

export async function POST(req: Request) {
  // Rate‑limit по IP
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { allowed, resetTime } = rateLimit(ip, 3, 60 * 1000) // 3 попытки в минуту
  if (!allowed) {
    const seconds = Math.ceil((resetTime! - Date.now()) / 1000)
    console.log(`[SECURITY] Registration rate limit exceeded for IP: ${ip}`)
    return NextResponse.json(
      { ok: false, error: `Слишком много попыток. Попробуйте через ${seconds} сек.` },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      console.log(`[SECURITY] Invalid registration data from IP: ${ip}`, parsed.error.issues)
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, phone } = parsed.data

    // Проверка, что пользователь с таким email уже нет
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.log(`[SECURITY] Registration attempt with existing email: ${email} from IP: ${ip}`)
      return NextResponse.json(
        { ok: false, error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // Проверка, что профиль с таким телефоном уже нет
    const existingPhone = await prisma.profile.findFirst({ where: { phone } })
    if (existingPhone) {
      console.log(`[SECURITY] Registration attempt with existing phone: ${phone} from IP: ${ip}`)
      return NextResponse.json(
        { ok: false, error: 'Пользователь с таким телефоном уже существует' },
        { status: 409 }
      )
    }

    // Хэширование пароля с усиленной солью
    const passwordHash = await bcrypt.hash(password, 12) // Увеличили с 10 до 12

    // Создание пользователя и профиля в транзакции
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        isAdmin: false,
        profile: {
          create: {
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // Уберём пароль из ответа
    const { password: _, ...userWithoutPassword } = user

    // Генерируем JWT и устанавливаем cookie
    const token = generateToken({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      roles: user.roles
    })
    const res = NextResponse.json({ ok: true, user: userWithoutPassword })
    setAuthCookie(res, token)

    console.log(`[SECURITY] Successful registration for email: ${email} from IP: ${ip}`)
    return res
  } catch (error) {
    console.error('[SECURITY] Register error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

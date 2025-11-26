import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateToken, setAuthCookie } from '@/lib/jwt'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rateLimit'

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
})

export async function POST(req: Request) {
  // Rate‑limit по IP
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { allowed, resetTime } = rateLimit(ip, 3, 60 * 1000) // Уменьшили до 3 попыток в минуту
  if (!allowed) {
    const seconds = Math.ceil((resetTime! - Date.now()) / 1000)
    console.log(`[SECURITY] Rate limit exceeded for IP: ${ip}`)
    return NextResponse.json(
      { ok: false, error: `Слишком много попыток. Попробуйте через ${seconds} сек.` },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      console.log(`[SECURITY] Invalid login data from IP: ${ip}`, parsed.error.issues)
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // Поиск пользователя с профилем
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user) {
      console.log(`[SECURITY] Login attempt with non-existent email: ${email} from IP: ${ip}`)
      return NextResponse.json(
        { ok: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверка пароля с усиленной защитой
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      console.log(`[SECURITY] Failed password attempt for email: ${email} from IP: ${ip}`)
      return NextResponse.json(
        { ok: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

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

    console.log(`[SECURITY] Successful login for email: ${email} from IP: ${ip}`)
    return res
  } catch (error) {
    console.error('[SECURITY] Login error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

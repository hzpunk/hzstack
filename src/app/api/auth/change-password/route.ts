import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { headers } from 'next/headers'

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Старый пароль обязателен'),
  newPassword: z.string().min(6, 'Новый пароль должен быть не менее 6 символов'),
})

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req as any)
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Неверный токен' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { oldPassword, newPassword } = parsed.data

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверка старого пароля
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'Неверный старый пароль' },
        { status: 401 }
      )
    }

    // Хэширование нового пароля
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Обновление пароля
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: newPasswordHash },
    })

    return NextResponse.json({ ok: true, message: 'Пароль успешно изменен' })
  } catch (error) {
    console.error('[SECURITY] Change password error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

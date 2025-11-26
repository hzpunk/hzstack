import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Удаляем уведомление, только если оно принадлежит текущему пользователю
    const deletedNotification = await prisma.notification.deleteMany({
      where: {
        id,
        userId: payload.userId,
      },
    })

    if (deletedNotification.count === 0) {
      return NextResponse.json(
        { ok: false, error: 'Уведомление не найдено' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, message: 'Уведомление удалено' })
  } catch (error) {
    console.error('[SECURITY] Delete notification error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

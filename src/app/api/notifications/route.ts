import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

const createNotificationSchema = z.object({
  text: z.string().min(1, 'Текст уведомления обязателен'),
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
    const parsed = createNotificationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { text } = parsed.data

    // Создаем уведомление в базе данных
    const notification = await prisma.notification.create({
      data: {
        content: text, // Используем поле content
        type: 'system',
        userId: payload.userId,
      },
    })

    return NextResponse.json({ 
      ok: true, 
      notification: {
        id: notification.id,
        text: notification.content, // Возвращаем как text для совместимости
        createdAt: notification.createdAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('[SECURITY] Create notification error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
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

    // Получаем уведомления пользователя
    const notifications = await prisma.notification.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Ограничиваем количество
    })

    return NextResponse.json({
      ok: true,
      notifications: notifications.map(n => ({
        id: n.id,
        text: n.content, // Используем поле content
        createdAt: n.createdAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('[SECURITY] Get notifications error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

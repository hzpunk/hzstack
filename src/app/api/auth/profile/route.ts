import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { verifyToken } from '@/lib/jwt'

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  interests: z.array(z.string()).optional(),
  privacy: z.any().optional(), // JSON blob
})

export async function PUT(req: Request) {
  try {
    // Проверяем JWT из cookie
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/)
    if (!tokenMatch) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const token = tokenMatch[1]
    const payload = verifyToken(token)
    if (!payload?.userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { firstName, lastName, role, interests, privacy } = parsed.data

    // Находим или создаём профиль пользователя
    const profile = await prisma.profile.upsert({
      where: { userId: payload.userId },
      update: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(role !== undefined && { role }),
        ...(interests !== undefined && { interests }),
        ...(privacy !== undefined && { privacy }),
      },
      create: {
        userId: payload.userId,
        firstName,
        lastName,
        role,
        interests,
        privacy,
      },
    })

    return NextResponse.json({ ok: true, profile })
  } catch (error) {
    console.error('[SECURITY] Profile PUT error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    // Проверяем JWT из cookie
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/)
    if (!tokenMatch) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const token = tokenMatch[1]
    const payload = verifyToken(token)
    if (!payload?.userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Неверные данные', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { role, interests, privacy } = parsed.data

    // Находим или создаём профиль пользователя
    const profile = await prisma.profile.upsert({
      where: { userId: payload.userId },
      update: {
        ...(role !== undefined && { role }),
        ...(interests !== undefined && { interests }),
        ...(privacy !== undefined && { privacy }),
      },
      create: {
        userId: payload.userId,
        role,
        interests,
        privacy,
      },
    })

    return NextResponse.json({ ok: true, profile })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Простой запрос к БД для проверки соединения
    const userCount = await prisma.user.count()
    return NextResponse.json({ ok: true, userCount })
  } catch (error) {
    console.error('Health check DB error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to connect to DB' },
      { status: 500 }
    )
  }
}

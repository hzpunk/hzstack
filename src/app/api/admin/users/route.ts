import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
  }

  // Check if current user is admin
  const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } })
  // if (!currentUser?.isAdmin) {
  //   return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  // }

  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Transform to safe user objects
  const safeUsers = users.map((user: { password: string; [key: string]: any }) => {
    const { password, ...rest } = user
    return rest
  })

  return NextResponse.json({ ok: true, users: safeUsers })
}
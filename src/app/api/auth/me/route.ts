import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, clearAuthCookie } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    const res = NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
    clearAuthCookie(res)
    return res
  }

  // Update lastActive for online status tracking
  try {
    await prisma.user.update({
      where: { id: payload.userId },
      // @ts-ignore
      data: { lastActive: new Date() },
    })
  } catch (e) {
    // Ignore update errors (e.g. user deleted)
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { profile: true },
  })

  if (!user) {
    // Token valid but user gone from DB -> clear cookie
    const res = NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    clearAuthCookie(res)
    return res
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user

  return NextResponse.json({ ok: true, user: userWithoutPassword })
}

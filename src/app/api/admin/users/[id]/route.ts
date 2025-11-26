import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

  // Prevent deleting self
  if (params.id === payload.userId) {
    return NextResponse.json({ ok: false, error: 'Cannot delete yourself' }, { status: 400 })
  }

  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to delete user' }, { status: 500 })
  }
}
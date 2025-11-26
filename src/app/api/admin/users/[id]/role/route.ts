import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { z } from 'zod'

const updateRoleSchema = z.object({
  roles: z.array(z.string())
})

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
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

  // Get current user with roles
  const currentUser = await prisma.user.findUnique({ 
    where: { id: payload.userId },
    include: { profile: true }
  })

  if (!currentUser) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
  }

  const body = await req.json()
  const parsed = updateRoleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid roles format', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { roles } = parsed.data

  // Check permissions based on current user roles
  const currentUserRoles = currentUser.roles || []
  const isCEO = currentUserRoles.includes('ceo')
  const isAdmin = currentUserRoles.includes('admin')
  const isManager = currentUserRoles.includes('manager')

  // Manager cannot change roles
  if (isManager && !isCEO && !isAdmin) {
    return NextResponse.json({ ok: false, error: 'Insufficient permissions' }, { status: 403 })
  }

  // Admin limitations: can only assign manager roles, cannot create new roles
  if (isAdmin && !isCEO) {
    const allowedRoles = ['manager']
    const hasInvalidRoles = roles.some(role => !allowedRoles.includes(role))
    
    if (hasInvalidRoles) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Admin can only assign manager roles' 
      }, { status: 403 })
    }
  }

  // CEO has full permissions
  // No restrictions for CEO

  // Prevent self-modification for non-CEO
  if (params.id === payload.userId && !isCEO) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Cannot modify your own roles' 
    }, { status: 403 })
  }

  try {
    // Get target user
    const targetUser = await prisma.user.findUnique({ 
      where: { id: params.id } 
    })

    if (!targetUser) {
      return NextResponse.json({ ok: false, error: 'Target user not found' }, { status: 404 })
    }

    // Prevent admin/manager from modifying CEO
    const targetRoles = targetUser.roles || []
    if (targetRoles.includes('ceo') && !isCEO) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Cannot modify CEO roles' 
      }, { status: 403 })
    }

    // Update user roles
    const isAdmin = roles.includes('admin')

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        roles,
        isAdmin,
      },
    })

    return NextResponse.json({ ok: true, user: updatedUser })
  } catch (error) {
    console.error('[SECURITY] Update role error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to update user roles' }, { status: 500 })
  }
}
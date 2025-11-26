import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { User } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-prod'

export interface JWTPayload {
  userId: string
  email: string
  isAdmin: boolean
  roles: string[]
}

export function generateToken(user: Pick<User, 'id' | 'email' | 'isAdmin' | 'roles'>): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      isAdmin: user.isAdmin,
      roles: user.roles || []
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 дней
    path: '/',
  })
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get('auth-token')?.value || null
}

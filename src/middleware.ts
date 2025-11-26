import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const path = request.nextUrl.pathname

  // Define protected paths
  const isProtectedPage = path.startsWith('/profile') || path.startsWith('/notifications') || path.startsWith('/admin')
  // Define auth paths that should redirect to profile if logged in
  // EXCLUDING /register/details because that's part of the onboarding for logged-in users
  const isGuestOnlyPage = (path.startsWith('/login') || path.startsWith('/register')) && !path.startsWith('/register/details')

  // Redirect to login if accessing protected page without token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin page protection - check if user has admin/manager/ceo roles
  if (path.startsWith('/admin') && token) {
    try {
      const payload = verifyToken(token.value)
      if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Check if user has admin, manager, or ceo roles
      const userRoles = payload.roles || []
      const hasAdminAccess = userRoles.includes('admin') || userRoles.includes('manager') || userRoles.includes('ceo')
      
      if (!hasAdminAccess) {
        console.log(`[SECURITY] Unauthorized admin access attempt by user ${payload.userId} with roles: ${userRoles.join(', ')}`)
        return NextResponse.redirect(new URL('/profile', request.url))
      }
      
    } catch (error) {
      console.error('[SECURITY] Middleware token verification error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to profile if accessing guest-only page with token
  if (isGuestOnlyPage && token) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/profile/:path*',
    '/notifications/:path*',
    '/admin/:path*',
    '/login',
    '/register/:path*'
  ],
}

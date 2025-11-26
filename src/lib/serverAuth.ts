import { headers } from 'next/headers'

export async function getCurrentUser() {
  const headersList = await headers()
  const cookie = headersList.get('cookie')
  // В серверных компонентах нет прямого доступа к cookies, поэтому делаем внутренний запрос к /api/auth/me
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/me`, {
      headers: { cookie: cookie || '' },
    })
    if (!res.ok) return null
    const { user } = await res.json()
    return user
  } catch {
    return null
  }
}

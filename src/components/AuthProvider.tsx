'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getMe } from '@/services/userService'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const load = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        setSession(token)
        if (token) {
          const me = await getMe()
          setUser(me)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [setLoading, setSession, setUser])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}


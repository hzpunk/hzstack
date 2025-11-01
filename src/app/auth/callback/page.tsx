"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Просто редиректим на страницу авторизации
    // Этот роут пока не используется (HZid отключен)
    router.push('/auth')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <div>Перенаправление...</div>
    </div>
  )
}


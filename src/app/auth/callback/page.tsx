"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { getHzidApiUrl, hzidGetMe } from '@/services/hzidService'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, setUser } = useAuthStore((state) => ({
    setToken: state.setToken,
    setUser: state.setUser,
  }))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        setError(`Ошибка авторизации: ${error}`)
        setTimeout(() => router.push('/auth'), 2000)
        return
      }

      if (!code) {
        // Нет кода, просто редиректим на страницу авторизации
        router.push('/auth')
        return
      }

      // Проверяем state для защиты от CSRF
      const savedState = typeof window !== 'undefined' ? localStorage.getItem('oauth_state') : null
      if (state && savedState && state !== savedState) {
        setError('Неверный state параметр. Попробуйте снова.')
        setTimeout(() => router.push('/auth'), 2000)
        return
      }

      // Обмениваем authorization code на токены
      try {
        const hzidApiUrl = getHzidApiUrl()
        const clientId = process.env.NEXT_PUBLIC_HZID_CLIENT_ID || ''
        const clientSecret = process.env.NEXT_PUBLIC_HZID_CLIENT_SECRET || ''
        const redirectUri = typeof window !== 'undefined' 
          ? `${window.location.origin}/auth/callback`
          : ''

        if (!clientId || !clientSecret) {
          throw new Error('HZid credentials not configured')
        }

        const response = await fetch(`${hzidApiUrl}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || errorData.message || `Ошибка получения токена (${response.status})`
          console.error('[Auth Callback] OAuth token exchange failed:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
          throw new Error(errorMessage)
        }

        const data = await response.json()

        if (data.access_token) {
          console.log('[Auth Callback] OAuth: Got HZid token from OAuth, exchanging to local')
          
          // Обмениваем HZid токен на локальный (создаст/обновит пользователя в БД)
          const { exchangeHzidTokenToLocal } = await import('@/services/hzidService')
          const exchangeResult = await exchangeHzidTokenToLocal(data.access_token)
          
          console.log('[Auth Callback] OAuth: Token exchanged', {
            localUserId: exchangeResult.user.id,
            email: exchangeResult.user.email,
            name: exchangeResult.user.name,
          })
          
          // Сохраняем локальный токен
          setToken(exchangeResult.accessToken, false)
          if (exchangeResult.refreshToken && typeof window !== 'undefined') {
            localStorage.setItem('refresh_token', exchangeResult.refreshToken)
          }

          // Получаем полные данные пользователя из локальной БД
          try {
            const { getMe } = await import('@/services/userService')
            const user = await getMe()
            
            console.log('[Auth Callback] OAuth: User data from local DB', {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              address: user.address,
            })
            
            setUser(user)
          } catch (err) {
            console.error('[Auth Callback] OAuth: Failed to fetch user data:', err)
            // Продолжаем даже если не удалось получить данные пользователя
          }

          // Перенаправляем на главную страницу
          router.push('/')
        } else {
          throw new Error('Токен не получен от сервера')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при авторизации'
        console.error('[Auth Callback] OAuth error:', err)
        setError(errorMessage)
        setTimeout(() => router.push('/auth'), 3000)
      } finally {
        // Очищаем сохраненный state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('oauth_state')
        }
      }
    }

    handleCallback()
  }, [searchParams, router, setToken])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      gap: '1rem'
    }}>
      {error ? (
        <>
          <div style={{ color: 'red' }}>{error}</div>
          <div>Перенаправление на страницу авторизации...</div>
        </>
      ) : (
        <div>Обработка авторизации...</div>
      )}
    </div>
  )
}


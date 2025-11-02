"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UI } from './ui'
import { Form } from './components'
import { HZid } from './widgets'
import { useAuthStore } from '@/stores/authStore'
import { checkHzidSession, tryGetHzidTokenFromSession } from '@/services/hzidService'
import styles from './page.module.scss'

export default function AuthPage() {
  const router = useRouter()
  const { setUser, setToken, isAuthenticated } = useAuthStore((state) => ({
    setUser: state.setUser,
    setToken: state.setToken,
    isAuthenticated: state.isAuthenticated,
  }))
  const [authMethod, setAuthMethod] = useState<'local' | 'hzid'>('local')
  const [isCheckingSession, setIsCheckingSession] = useState(false)

  // Если уже залогинен, перенаправляем на главную
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // При выборе HZid метода проверяем активную сессию
  useEffect(() => {
    if (authMethod === 'hzid' && !isAuthenticated) {
      const checkSession = async () => {
        setIsCheckingSession(true)
        try {
          const hzidUser = await checkHzidSession()
          
          if (hzidUser) {
            console.log('[Auth Page] Auto login: Active HZid session found', {
              id: hzidUser.id,
              email: hzidUser.email,
            })
            
            // Пользователь уже залогинен на HZid - автоматически логиним
            const tokens = await tryGetHzidTokenFromSession()
            
            if (tokens) {
              console.log('[Auth Page] Auto login: Got tokens, exchanging to local')
              
              // Обмениваем HZid токен на локальный
              const { exchangeHzidTokenToLocal } = await import('@/services/hzidService')
              const exchangeResult = await exchangeHzidTokenToLocal(tokens.access_token)
              
              console.log('[Auth Page] Auto login: Token exchanged', {
                localUserId: exchangeResult.user.id,
                email: exchangeResult.user.email,
              })
              
              // Сохраняем локальный токен
              setToken(exchangeResult.accessToken, false)
              
              // Получаем данные из локальной БД
              const { getMe } = await import('@/services/userService')
              const user = await getMe()
              
              console.log('[Auth Page] Auto login: User data from local DB', {
                id: user.id,
                email: user.email,
                name: user.name,
              })
              
              setUser(user)
              router.push('/')
              return
            }
          } else {
            // Сессии нет - автоматически перенаправляем на HZid для входа/регистрации
            const hzidApiUrl = process.env.NEXT_PUBLIC_HZID_API_URL || 'https://hzid.vercel.app/api'
            const clientId = process.env.NEXT_PUBLIC_HZID_CLIENT_ID || ''
            const redirectUri = typeof window !== 'undefined' 
              ? `${window.location.origin}/auth/callback`
              : ''
            
            if (clientId) {
              const state = Math.random().toString(36).substring(7)
              localStorage.setItem('oauth_state', state)
              
              // Перенаправляем на OAuth авторизацию HZid
              const authUrl = `${hzidApiUrl}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile email&state=${state}`
              window.location.href = authUrl
              return
            }
          }
        } catch (error) {
          // Ошибка проверки сессии - показываем форму входа
          console.log('Error checking HZid session:', error)
        } finally {
          setIsCheckingSession(false)
        }
      }
      
      checkSession()
    }
  }, [authMethod, isAuthenticated, router, setUser, setToken])

  // Если проверяем сессию, показываем индикатор загрузки
  if (isCheckingSession) {
    return (
      <UI>
        <div className={styles.authContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Проверка сессии HZid...</div>
          </div>
        </div>
      </UI>
    )
  }

  return (
    <UI>
      <div className={styles.authContainer}>
        {/* Переключатель способа входа */}
        <div className={styles.authToggle}>
          <button
            type="button"
            onClick={() => setAuthMethod('local')}
            className={`${styles.toggleButton} ${authMethod === 'local' ? styles.active : ''}`}
          >
            Локальный вход
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('hzid')}
            className={`${styles.toggleButton} ${authMethod === 'hzid' ? styles.active : ''}`}
          >
            Вход через HZid
          </button>
        </div>

        {/* Форма входа в зависимости от выбранного метода */}
        {authMethod === 'local' ? <Form /> : <HZid />}
      </div>
    </UI>
  )
}

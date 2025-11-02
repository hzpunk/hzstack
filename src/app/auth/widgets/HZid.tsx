"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared'
import { useAuthStore } from '@/stores/authStore'
import { hzidLogin, hzidSignup, hzidGetMe } from '@/services/hzidService'
import styles from './HZid.module.scss'

export const HZid = () => {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore((state) => ({
    setUser: state.setUser,
    setToken: state.setToken,
  }))
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dob: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        // Вход через HZid API
        console.log('[HZid Widget] Login: Starting login', { email: formData.email })
        const response = await hzidLogin(formData.email, formData.password)
        
        console.log('[HZid Widget] Login: Got HZid token, exchanging to local')
        
        // Обмениваем HZid токен на локальный (создаст/обновит пользователя в БД)
        const { exchangeHzidTokenToLocal } = await import('@/services/hzidService')
        const exchangeResult = await exchangeHzidTokenToLocal(response.tokens.access_token)
        
        console.log('[HZid Widget] Login: Token exchanged', {
          localUserId: exchangeResult.user.id,
          email: exchangeResult.user.email,
          name: exchangeResult.user.name,
        })
        
        // Сохраняем локальный токен
        setToken(exchangeResult.accessToken, false)
        
        // Получаем полные данные пользователя из локальной БД
        const { getMe } = await import('@/services/userService')
        const user = await getMe()
        
        console.log('[HZid Widget] Login: User data from local DB', {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address,
        })
        
        setUser(user)
        router.push('/')
      } else {
        // Регистрация через HZid API
        if (!formData.name) {
          setError('Пожалуйста, укажите имя')
          setIsLoading(false)
          return
        }

        const username = formData.email.split('@')[0] || `user_${Date.now()}`
        await hzidSignup(
          formData.email,
          formData.password,
          username,
          formData.name
        )
        
        // После регистрации логинимся
        console.log('[HZid Widget] Register: Login after signup', { email: formData.email })
        const response = await hzidLogin(formData.email, formData.password)
        
        console.log('[HZid Widget] Register: Got HZid token, exchanging to local')
        
        // Обмениваем HZid токен на локальный (создаст/обновит пользователя в БД)
        const { exchangeHzidTokenToLocal } = await import('@/services/hzidService')
        const exchangeResult = await exchangeHzidTokenToLocal(response.tokens.access_token)
        
        console.log('[HZid Widget] Register: Token exchanged', {
          localUserId: exchangeResult.user.id,
          email: exchangeResult.user.email,
          name: exchangeResult.user.name,
        })
        
        // Сохраняем локальный токен
        setToken(exchangeResult.accessToken, false)
        
        // Получаем полные данные пользователя из локальной БД
        const { getMe } = await import('@/services/userService')
        const user = await getMe()
        
        console.log('[HZid Widget] Register: User data from local DB', {
          id: user.id,
          email: user.email,
          name: user.name,
        })
        
        setUser(user)
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setError(null)
      setIsLoading(true)
      
      // OAuth через HZid API
      // Согласно документации, нужно использовать /oauth/authorize
      const hzidApiUrl = process.env.NEXT_PUBLIC_HZID_API_URL || 'https://hzid.vercel.app/api'
      const clientId = process.env.NEXT_PUBLIC_HZID_CLIENT_ID || ''
      const redirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : ''
      
      if (!clientId) {
        throw new Error('HZid client ID not configured')
      }

      const state = Math.random().toString(36).substring(7)
      localStorage.setItem('oauth_state', state)
      
      const authUrl = `${hzidApiUrl}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile email&state=${state}`
      
      window.location.href = authUrl
      
      // Редирект произойдет автоматически
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
      setIsLoading(false)
    }
  }


  return (
    <div className={styles.hzid}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.case}>
          <div className={styles.text_h2}>
            {isLogin ? 'Вход через HZid' : 'Регистрация через HZid'}
          </div>
        </label>

        {error && (
          <div className={styles.error} style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}

        <label className={styles.case}>
          <div className={styles.text_text}>Email</div>
          <input 
            className={styles.input} 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="your@email.com"
          />
        </label>

        <label className={styles.case}>
          <div className={styles.text_text}>Пароль</div>
          <input 
            className={styles.input}  
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="••••••••"
            minLength={8}
          />
        </label>

        {!isLogin && (
          <>
            <label className={styles.case}>
              <div className={styles.text_text}>Имя</div>
              <input 
                className={styles.input} 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                required={!isLogin}
                disabled={isLoading}
                placeholder="Ваше имя"
              />
            </label>

            <label className={styles.case}>
              <div className={styles.text_text}>Дата рождения (необязательно)</div>
              <input 
                className={styles.input} 
                type="date" 
                name="dob"
                value={formData.dob} 
                onChange={handleChange} 
                disabled={isLoading}
              />
            </label>
          </>
        )}

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          <Button text={isLoading ? "Загрузка..." : (isLogin ? "Войти" : "Зарегистрироваться")} />
        </button>

        <div className={styles.switchMode}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
            }}
            className={styles.switchButton}
            disabled={isLoading}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        <div className={styles.divider}>
          <span>или</span>
        </div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className={styles.socialButton}
          >
            <Button text="Войти через Google" />
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            className={styles.socialButton}
          >
            <Button text="Войти через GitHub" />
          </button>
        </div>
      </form>
    </div>
  )
}

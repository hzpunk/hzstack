"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/shared'
import { useAuthStore } from '@/stores/authStore'
import { exchangeHzidToken } from '@/services/hzid'
import { getMe } from '@/services/userService'
import styles from './HZid.module.scss'

// Инициализация Supabase клиента для HZid
const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_HZID_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_HZID_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('HZid credentials not configured. Please set NEXT_PUBLIC_HZID_URL and NEXT_PUBLIC_HZID_ANON_KEY')
  }

  return createClient(url, anonKey)
}

export const HZid = () => {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
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
      const supabase = getSupabaseClient()

      if (isLogin) {
        // Вход через HZid
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          throw new Error(signInError.message || 'Ошибка входа')
        }

        if (!data.session?.access_token) {
          throw new Error('Токен не получен от HZid')
        }

        // Обмениваем HZid токен на локальный
        const exchangeResult = await exchangeHzidToken(data.session.access_token)
        
        // Устанавливаем токен
        setToken(exchangeResult.accessToken)
        
        // Получаем данные пользователя
        const user = await getMe()
        setUser(user)

        router.push('/')
      } else {
        // Регистрация через HZid
        if (!formData.name) {
          setError('Пожалуйста, укажите имя')
          setIsLoading(false)
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              date_of_birth: formData.dob || null,
            }
          }
        })

        if (signUpError) {
          throw new Error(signUpError.message || 'Ошибка регистрации')
        }

        if (!data.session?.access_token) {
          // Если email требует подтверждения, показываем сообщение
          setError('Проверьте вашу почту для подтверждения регистрации')
          setIsLoading(false)
          return
        }

        // Обмениваем HZid токен на локальный
        const exchangeResult = await exchangeHzidToken(data.session.access_token)
        
        // Устанавливаем токен
        setToken(exchangeResult.accessToken)
        
        // Получаем данные пользователя
        const user = await getMe()
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
      const supabase = getSupabaseClient()

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      })

      if (oauthError) {
        throw new Error(oauthError.message || `Ошибка входа через ${provider}`)
      }

      // OAuth редирект произойдет автоматически
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

        {error && <div className={styles.error}>{error}</div>}

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

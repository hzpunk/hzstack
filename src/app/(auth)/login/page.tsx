'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { HeaderLogo } from '@/components/HeaderLogo'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { AuthIdButton } from '@/components/auth/AuthIdButton'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok || !result.ok) {
        setServerError(result.error || 'Ошибка входа')
        return
      }
      // Сохраняем пользователя в Zustand (без пароля)
      login({
        firstName: result.user.profile?.firstName || '',
        lastName: result.user.profile?.lastName || '',
        role: result.user.isAdmin ? 'admin' : 'user',
        roles: result.user.roles || [],
        phone: result.user.profile?.phone || '',
        email: result.user.email || '',
        avatar: result.user.profile?.avatar || null,
      })
      router.push('/')
    } catch (e) {
      setServerError('Ошибка сети')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
      <div className="mb-[114px] flex h-9 items-center justify-center">
        <div className="scale-150">
          <HeaderLogo />
        </div>
      </div>

      <div className="w-full max-w-[594px]">
        <h1 className="typography-h1 mb-[28px] uppercase tracking-wider text-left text-[80px] leading-none">
          ВХОД
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[26px]"
        >
          <AuthInput
            placeholder="EMAIL"
            type="email"
            error={errors.email?.message}
            autoComplete="off"
            {...register('email')}
          />
          <AuthInput
            placeholder="ПАРОЛЬ"
            type="password"
            error={errors.password?.message}
            showPasswordToggle
            autoComplete="current-password"
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link
              href="/register"
              className="font-cygre text-sm text-black/40 hover:text-black transition-colors"
            >
              регистрация
            </Link>
          </div>

          {serverError && (
            <div className="text-red-500 text-sm text-center">{serverError}</div>
          )}

          <div className="space-y-6">
            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'далее'}
            </AuthButton>
            <AuthIdButton />
          </div>
        </form>
      </div>
    </div>
  )
}

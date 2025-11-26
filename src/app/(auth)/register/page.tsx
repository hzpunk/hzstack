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

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Обязательное поле' }),
    lastName: z.string().min(1, { message: 'Обязательное поле' }),
    email: z.string().email({ message: 'Введите корректный email' }),
    phone: z
      .string()
      .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, {
        message: 'Формат: +7 (999) 999-99-99',
      }),
    password: z.string().min(6, { message: 'Минимум 6 символов' }),
    confirmPassword: z.string().min(6, { message: 'Минимум 6 символов' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const login = useAuthStore((state) => state.login)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setServerError(null)
    try {
      // Remove mask characters before sending
      const phoneDigits = data.phone.replace(/\D/g, '').slice(1) // remove +7
      const payload = { ...data, phone: phoneDigits }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result.ok) {
        setServerError(result.error || 'Ошибка регистрации')
        return
      }
      login({
        firstName: result.user.profile?.firstName || '',
        lastName: result.user.profile?.lastName || '',
        role: result.user.isAdmin ? 'admin' : 'user',
        roles: result.user.roles || [],
        phone: result.user.profile?.phone || '',
        email: result.user.email || '',
        avatar: result.user.profile?.avatar || null,
      })
      router.push('/register/details')
    } catch (e) {
      setServerError('Ошибка сети')
    } finally {
      setIsLoading(false)
    }
  }

  // Strict mask handling for +7 (XXX) XXX-XX-XX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '') // strip non-digits

    // If user clears everything, allow empty
    if (!val) {
      setValue('phone', '')
      return
    }

    // If starts with 7, keep it. If starts with 8, replace with 7. Else, prepend 7.
    if (val.startsWith('8')) val = '7' + val.slice(1)
    if (!val.startsWith('7')) val = '7' + val

    // Truncate to max 11 digits (7 + 10 digits)
    val = val.slice(0, 11)

    // Apply mask
    let formatted = '+7'
    if (val.length > 1) formatted += ` (${val.slice(1, 4)}`
    if (val.length > 4) formatted += `) ${val.slice(4, 7)}`
    if (val.length > 7) formatted += `-${val.slice(7, 9)}`
    if (val.length > 9) formatted += `-${val.slice(9, 11)}`

    setValue('phone', formatted, { shouldValidate: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
      <div className="mb-[114px] flex h-9 items-center justify-center">
        <div className="scale-150">
          <HeaderLogo />
        </div>
      </div>

      <div className="w-full max-w-[594px]">
        <h1 className="typography-h1 mb-[28px] uppercase tracking-wider text-left text-[80px] leading-none whitespace-nowrap overflow-visible">
          регистрация
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[26px]"
        >
          <div className="flex gap-[26px]">
            <AuthInput
              placeholder="ИМЯ"
              error={errors.firstName?.message}
              autoComplete="off"
              {...register('firstName')}
            />
            <AuthInput
              placeholder="ФАМИЛИЯ"
              error={errors.lastName?.message}
              autoComplete="off"
              {...register('lastName')}
            />
          </div>

          <AuthInput
            placeholder="EMAIL"
            type="email"
            error={errors.email?.message}
            autoComplete="off"
            {...register('email')}
          />

          <AuthInput
            placeholder="ТЕЛЕФОН"
            type="tel"
            error={errors.phone?.message}
            autoComplete="off"
            {...register('phone')}
            onChange={handlePhoneChange}
          />

          <AuthInput
            placeholder="ПАРОЛЬ"
            type="password"
            error={errors.password?.message}
            showPasswordToggle
            autoComplete="new-password"
            {...register('password')}
          />
          <AuthInput
            placeholder="ПОВТОРИТЕ ПАРОЛЬ"
            type="password"
            error={errors.confirmPassword?.message}
            showPasswordToggle
            autoComplete="new-password"
            {...register('confirmPassword')}
          />

          <div className="flex justify-end">
            <Link
              href="/login"
              className="font-cygre text-sm text-black/40 hover:text-black transition-colors"
            >
              войти
            </Link>
          </div>

          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}

          <div className="space-y-6">
            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'далее'}
            </AuthButton>
            <AuthIdButton />
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { HeaderLogo } from '@/components/HeaderLogo'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { useAuthStore } from '@/store/useAuthStore'
import { useState, ChangeEvent } from 'react'
import { Upload } from 'lucide-react'

const detailsSchema = z.object({
  role: z.string().min(1, { message: 'Обязательное поле' }),
  interests: z.string().min(1, { message: 'Выберите интерес' }),
  privacy: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо принять условия' }),
  }),
})

type DetailsFormData = z.infer<typeof detailsSchema>

export default function RegisterDetailsPage() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
  })

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const onSubmit = async (data: DetailsFormData) => {
    try {
      // Преобразуем interests в массив
      const payload = {
        ...data,
        interests: data.interests ? [data.interests] : [],
      }
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result.ok) {
        alert(result.error || 'Ошибка сохранения профиля')
        return
      }
      router.push('/')
    } catch (e) {
      alert('Ошибка сети')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-12">
      <div className="mb-[60px] flex h-9 items-center justify-center">
        <div className="scale-75">
          <HeaderLogo />
        </div>
      </div>

      <div className="w-full max-w-[594px] flex flex-col items-center">
        {/* Avatar Placeholder */}
        <label className="w-[200px] h-[260px] border border-black mb-4 bg-white cursor-pointer flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative overflow-hidden">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 opacity-50" />
              <span className="text-xs lowercase">загрузить фото</span>
            </div>
          )}
        </label>

        {/* User Name */}
        <div className="typography-h2 lowercase mb-[60px]">
          {user ? `${user.firstName} ${user.lastName}` : 'иван петров'}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[26px]"
        >
          <AuthInput
            placeholder="ваша должность"
            error={errors.role?.message}
            autoComplete="off"
            {...register('role')}
          />

          <div className="relative">
            <select
              {...register('interests')}
              className="w-full h-[60px] border border-black bg-white px-6 font-cygre text-lg uppercase placeholder:text-black/30 focus:outline-none appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                ИНТЕРЕСЫ
              </option>
              <option value="dev">РАЗРАБОТКА</option>
              <option value="design">ДИЗАЙН</option>
              <option value="marketing">МАРКЕТИНГ</option>
              <option value="management">МЕНЕДЖМЕНТ</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px]">
              ▶
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="privacy"
              {...register('privacy')}
              className="w-5 h-5 border border-black rounded-none appearance-none checked:bg-black checked:border-black cursor-pointer relative after:content-[''] after:hidden checked:after:block after:w-2 after:h-2 after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
            />
            <label
              htmlFor="privacy"
              className="text-sm text-gray-500 lowercase cursor-pointer select-none"
            >
              я принимаю условия конфиденциальности и<br />
              правила площадки
            </label>
          </div>
          {errors.privacy && (
            <span className="text-red-500 text-xs lowercase">
              {errors.privacy.message}
            </span>
          )}

          <div className="mt-8">
            <AuthButton type="submit">зарегистрироваться</AuthButton>
          </div>
        </form>
      </div>
    </div>
  )
}

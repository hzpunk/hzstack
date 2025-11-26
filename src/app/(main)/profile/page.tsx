'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import Image from 'next/image'
import { Camera, X, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProfileData {
  firstName: string
  lastName: string
  role: string
  interests: string[]
  phone: string
  email: string
  avatar?: string | null
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordState, setPasswordState] = useState<'old' | 'new'>('old')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNextButton, setShowNextButton] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    role: '',
    interests: [] as string[]
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    if (user) {
      // Загружаем профиль с сервера
      fetch('/api/auth/profile')
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.profile) {
            const profileData = {
              firstName: data.profile.firstName || user.firstName,
              lastName: data.profile.lastName || user.lastName,
              role: data.profile.role || user.role || '',
              interests: data.profile.interests || [],
              phone: data.profile.phone || user.phone || '',
              email: user.email || '',
              avatar: data.profile.avatar || null
            }
            setProfile(profileData)
            setEditForm({
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              role: profileData.role,
              interests: profileData.interests
            })
          } else {
            // Fallback на данные пользователя
            setProfile({
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              interests: [],
              phone: user.phone || '',
              email: user.email || '',
              avatar: null
            })
            setEditForm({
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              interests: []
            })
          }
        })
        .catch(error => {
          console.error('Failed to load profile:', error)
          // Fallback на данные пользователя при ошибке
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            interests: [],
            phone: user.phone || '',
            email: user.email || '',
            avatar: null
          })
          setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            interests: []
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user])

  // Format 10-digit string to +7 (XXX) XXX-XX-XX
  const formatPhone = (phoneStr: string) => {
    if (!phoneStr) return '+7 (999) 000-00-00'
    // Strip non-digits just in case
    const digits = phoneStr.replace(/\D/g, '')
    // If it doesn't look like a 10-digit number, return as is
    if (digits.length < 10) return phoneStr

    // Take last 10 digits if longer (e.g. 7999...)
    const clean = digits.slice(-10)

    return `+7 (${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 10)}`
  }

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOldPassword(value)
    setShowNextButton(value.length > 0)
  }

  const handleNextClick = () => {
    setPasswordState('new')
    setShowNextButton(false)
  }

  const handleChangePassword = async () => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      const result = await res.json()
      if (result.ok) {
        // Создаем уведомление в системе
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Пароль успешно сменен' }),
        })
        
        // Показываем всплывающее окно
        setShowSuccessNotification(true)
        
        // Возвращаем к начальному состоянию
        setPasswordState('old')
        setOldPassword('')
        setNewPassword('')
        setShowNextButton(false)
        
        // Скрываем всплывающее окно через 3 секунды
        setTimeout(() => {
          setShowSuccessNotification(false)
        }, 3000)
      } else {
        console.error('Error changing password:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const result = await res.json()
      if (result.ok) {
        setProfile(prev => ({
          ...prev!,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          role: editForm.role,
          interests: editForm.interests
        }))
        setIsEditing(false)
        
        // Создаем уведомление
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Профиль успешно обновлен' }),
        })
      } else {
        console.error('Error updating profile:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        interests: profile.interests
      })
    }
    setIsEditing(false)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Допустимы только JPEG, PNG и WebP форматы')
      return
    }

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Максимальный размер файла - 5MB')
      return
    }

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()
      
      if (result.ok) {
        // Обновляем профиль с новым аватаром
        setProfile(prev => prev ? { ...prev, avatar: result.avatarUrl } : null)
        
        // Обновляем пользователя в store
        const currentUser = useAuthStore.getState().user
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            avatar: result.avatarUrl
          })
        }

        // Создаем уведомление
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Аватар успешно обновлен' }),
        })
      } else {
        console.error('Avatar upload error:', result.error)
        alert('Ошибка при загрузке аватара')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert('Ошибка при загрузке аватара')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white px-8 2xl:px-[357px] pt-40">
        <div className="text-gray-500 lowercase">загрузка...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="w-full min-h-screen bg-white px-8 2xl:px-[357px] pt-40">
        <div className="text-gray-500 lowercase">профиль не найден</div>
      </div>
    )
  }

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="flex flex-col lg:flex-row pt-[100px] lg:pt-[150px] pb-20">
        {/* Left Column: Avatar & Info */}
        <motion.div 
          className="flex flex-col items-center lg:items-start lg:ml-[100px] xl:ml-[150px] 2xl:ml-[357px] w-full lg:w-[286px] shrink-0 px-[20px] lg:px-0 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Avatar 286x286 */}
          <div className="w-[286px] h-[286px] bg-[#E5E5E5] relative overflow-hidden group cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera size={64} strokeWidth={1} />
              </div>
            )}
            
            {/* Overlay для загрузки */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {isUploadingAvatar ? (
                <div className="text-white text-sm">загрузка...</div>
              ) : (
                <div className="text-white text-center">
                  <Camera size={32} strokeWidth={1} />
                  <div className="text-xs mt-1">изменить</div>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="mt-[24px] text-center lg:text-left flex items-center justify-between w-full">
            <div className="flex items-center justify-center lg:justify-start">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="text-[32px] leading-tight lowercase font-normal bg-transparent border-0 outline-none w-[120px]"
                  />
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="text-[32px] leading-tight lowercase font-normal bg-transparent border-0 outline-none w-[120px]"
                  />
                </div>
              ) : (
                <h1 className="text-[32px] leading-tight lowercase font-normal whitespace-nowrap">
                  {profile.firstName} {profile.lastName}
                </h1>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit3 size={20} className="text-black" />
              </button>
            )}
          </div>

          {/* Role */}
          <div className="mt-[14px] text-center lg:text-left">
            {isEditing ? (
              <input
                type="text"
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                className="text-[20px] text-[#070D0D] lowercase leading-tight bg-transparent border-0 outline-none w-[200px]"
              />
            ) : (
              <p className="text-[20px] text-[#070D0D] lowercase leading-tight">
                {profile.role}
              </p>
            )}
          </div>

          {/* Interests */}
          <div className="mt-[17px] flex flex-wrap gap-2 justify-center lg:justify-start">
            {isEditing ? (
              <input
                type="text"
                value={editForm.interests.join(', ')}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  interests: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="увлечения через запятую"
                className="text-[20px] text-[#070D0D] lowercase leading-tight bg-transparent border-0 outline-none w-[300px]"
              />
            ) : (
              profile.interests.map((tag, i) => (
                <span
                  key={i}
                  className="text-[20px] text-[#070D0D] lowercase leading-tight"
                >
                  #{tag}
                </span>
              ))
            )}
          </div>

          {/* Кнопки сохранения/отмены */}
          {isEditing && (
            <div className="mt-[20px] flex gap-4 justify-center lg:justify-start">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 border border-black bg-transparent text-[16px] lowercase font-cygre hover:bg-black hover:text-white transition-colors"
              >
                сохранить
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 bg-transparent text-[16px] lowercase font-cygre hover:bg-gray-100 transition-colors"
              >
                отмена
              </button>
            </div>
          )}
        </motion.div>

        {/* Right Column: Contacts & Inputs - выезжает из-под первого блока */}
        <motion.div 
          className="flex flex-col pt-[60px] lg:pt-0 w-full max-w-[594px] px-[20px] lg:px-0 lg:ml-[-150px] lg:mt-0 relative z-0"
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 170 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.3,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* Phone */}
          <div className="typography-h2 lowercase mb-1">
            {formatPhone(profile.phone)}
          </div>

          {/* Email */}
          <div className="typography-h2 lowercase mb-[80px] lg:mb-[120px]">
            {profile.email}
          </div>

          {/* Old Password Input */}
          <div className="w-full">
            <input
              type="password"
              placeholder={passwordState === 'old' ? 'старый пароль' : 'новый пароль'}
              value={passwordState === 'old' ? oldPassword : newPassword}
              onChange={(e) => {
                if (passwordState === 'old') {
                  handleOldPasswordChange(e)
                } else {
                  setNewPassword(e.target.value)
                }
              }}
              className="w-full lg:w-[594px] h-[56px] bg-transparent border-0 border-b border-black text-[20px] outline-none placeholder:text-black/65 lowercase font-cygre"
            />
            
            {/* Кнопка Далее/Сменить */}
            {showNextButton && passwordState === 'old' && (
              <button
                onClick={handleNextClick}
                className="w-full lg:w-[593px] h-[54px] border-2 border-black bg-transparent text-[20px] lowercase font-cygre mt-4 hover:bg-black hover:text-white transition-colors"
              >
                далее
              </button>
            )}
            
            {passwordState === 'new' && newPassword.length > 0 && (
              <button
                onClick={handleChangePassword}
                className="w-full lg:w-[593px] h-[54px] border-2 border-black bg-transparent text-[20px] lowercase font-cygre mt-4 hover:bg-black hover:text-white transition-colors"
              >
                сменить
              </button>
            )}
          </div>
        </motion.div>

        {/* Spacer for desktop */}
        <div className="hidden lg:block w-[663px] shrink-0" />
      </div>
      
      {/* Всплывающее окно уведомления */}
      {showSuccessNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[200px] right-2 lg:right-8 z-50 bg-white border border-black px-4 py-3 flex items-center justify-between w-[calc(100vw-16px)] lg:w-[593px] h-[54px]"
        >
          <span className="text-[16px] lg:text-[20px] lowercase font-cygre">
            Пароль успешно сменен
          </span>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="ml-4 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </main>
  )
}

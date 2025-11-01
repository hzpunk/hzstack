"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuthStore } from '@/stores/authStore'
import { updateProfile, changePassword, type UserProfile } from '@/services/userService'
import { Button } from '@/shared'
import styles from './page.module.scss'

export default function ProfilePage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
      })
    }
  }, [user, isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
    setError(null)
    setSuccess(null)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      // updateProfile принимает данные для обновления, id берет из текущего пользователя
      const updatedProfile = await updateProfile(formData)
      setSuccess('Профиль успешно обновлен')
      setIsEditing(false)
      // Обновляем данные в store с данными от сервера
      useAuthStore.getState().setUser(updatedProfile as UserProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления профиля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Пароль должен быть не менее 8 символов')
      return
    }

    setIsLoading(true)

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword)
      setSuccess('Пароль успешно изменен')
      setIsChangingPassword(false)
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка изменения пароля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  if (!user || !isAuthenticated) {
    return (
      <div className={styles.loading}>
        <div>Загрузка...</div>
      </div>
    )
  }

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <h1 className={styles.title}>Профиль</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Информация о пользователе */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Личная информация</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
                disabled={isLoading}
              >
                Редактировать
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className={styles.form}>
              <label className={styles.label}>
                <span className={styles.labelText}>Имя</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Телефон</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Адрес</span>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className={styles.textarea}
                  disabled={isLoading}
                  rows={3}
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Дата рождения</span>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                />
              </label>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setError(null)
                    setSuccess(null)
                    // Восстанавливаем оригинальные данные
                    if (user) {
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        date_of_birth: user.date_of_birth || '',
                      })
                    }
                  }}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Отмена
                </button>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                  <Button text={isLoading ? "Сохранение..." : "Сохранить"} />
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Имя:</span>
                <span className={styles.infoValue}>{user.name || 'Не указано'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Телефон:</span>
                <span className={styles.infoValue}>{user.phone || 'Не указано'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Адрес:</span>
                <span className={styles.infoValue}>{user.address || 'Не указано'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Дата рождения:</span>
                <span className={styles.infoValue}>
                  {user.date_of_birth
                    ? format(new Date(user.date_of_birth), 'd MMMM yyyy', {
                        locale: ru,
                      })
                    : 'Не указано'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Роль:</span>
                <span className={styles.infoValue}>{user.role || 'user'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Смена пароля */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Безопасность</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className={styles.editButton}
                disabled={isLoading}
              >
                Изменить пароль
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className={styles.form}>
              <label className={styles.label}>
                <span className={styles.labelText}>Текущий пароль</span>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Новый пароль</span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                  minLength={8}
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>Подтвердите новый пароль</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                  minLength={8}
                />
              </label>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    setError(null)
                    setSuccess(null)
                  }}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Отмена
                </button>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                  <Button text={isLoading ? "Изменение..." : "Изменить пароль"} />
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Двухфакторная аутентификация:</span>
                <span className={styles.infoValue}>
                  {user.two_factor_enabled ? 'Включена' : 'Отключена'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Выход */}
        <div className={styles.section}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  )
}


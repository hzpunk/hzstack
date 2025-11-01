'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import styles from "./Profile.module.scss"

export const Profile = () => {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleClick = () => {
    if (isAuthenticated && user) {
      router.push('/profile')
    } else {
      router.push('/auth')
    }
  }

  return (
    <div className={styles.button} onClick={handleClick}>
      {isAuthenticated && user ? user.name || user.email : 'Присоединиться'}
    </div>
  )
}

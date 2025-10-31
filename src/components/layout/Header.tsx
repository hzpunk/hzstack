'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './Header.module.scss'

export default function Header() {
  const { user, logout, isLoading } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    logout()
    router.push('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>Hzhr</h1>
        </Link>

        <nav className={styles.nav}>
          <Link href="/vacancies">Вакансии</Link>
          {user && <Link href="/profile">Профиль</Link>}
          {user?.role === 'company' && <Link href="/company/dashboard">Панель</Link>}
          {user && <Link href="/chat">Чат</Link>}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.user}>{user.name || 'Пользователь'}</span>
              <button onClick={handleLogout} className={styles.logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.login}>
                Войти
              </Link>
              <Link href="/register" className={styles.register}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import styles from './BurgerMenu.module.scss'

export const BurgerMenu = () => {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInsidePanel =
        !!panelRef.current && panelRef.current.contains(target)
      const clickedOnButton =
        !!buttonRef.current && buttonRef.current.contains(target)

      if (open && !clickedInsidePanel && !clickedOnButton) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const handleLogout = () => {
    logout()
    setOpen(false)
    router.push('/auth')
  }

  const menuItems = [
    { label: 'Главная', href: '/', action: () => { router.push('/'); setOpen(false) } },
    { label: 'Примеры', href: '/examples', action: () => { router.push('/examples'); setOpen(false) } },
    ...(isAuthenticated
      ? [
          { label: 'Профиль', href: '/profile', action: () => { router.push('/profile'); setOpen(false) } },
          { label: 'Выйти', href: '#', action: handleLogout },
        ]
      : [
          { label: 'Войти', href: '/auth', action: () => { router.push('/auth'); setOpen(false) } },
        ]),
  ]

  return (
    <>
      <motion.button
        aria-expanded={open}
        aria-controls="burger-menu"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        ref={buttonRef}
        className={styles.case}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          position: 'relative',
        }}
      >
        <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
          Открыть меню
        </span>
        <motion.div
          className={styles.line}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, margin: '0 auto' }}
          animate={
            open
              ? { y: 9, rotate: 45, width: '50%' }
              : { y: 0, rotate: 0, width: '100%' }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        <motion.div
          className={styles.line}
          style={{ position: 'absolute', top: 9, left: 0, right: 0, margin: '0 auto' }}
          animate={
            open
              ? { opacity: 0, width: '50%' }
              : { opacity: 1, width: '100%' }
          }
          transition={{ duration: 0.15 }}
        />
        <motion.div
          className={styles.line}
          style={{ position: 'absolute', top: 18, left: 0, right: 0, margin: '0 auto' }}
          animate={
            open
              ? { y: -9, rotate: -45, width: '50%' }
              : { y: 0, rotate: 0, width: '100%' }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
              }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="burger-menu"
              ref={panelRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: '80px',
                zIndex: 1000,
                backgroundColor: '#fff',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      item.action()
                    }}
                    style={{
                      color: '#000',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ x: 5, opacity: 0.7 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

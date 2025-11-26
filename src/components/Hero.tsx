'use client'

import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

export function Hero() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  const handleStart = () => {
    if (isAuthenticated) {
      router.push('/profile')
    } else {
      router.push('/register')
    }
  }

  return (
    <section className="w-full flex flex-col justify-center px-8 py-20 md:py-32 gap-12">
      <motion.h1
        className="typography-h1 lowercase leading-tight max-w-4xl 2xl:max-w-none 2xl:whitespace-nowrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {isAuthenticated && user
          ? `добро пожаловать ${user.lastName} ${user.firstName.charAt(0)}.`
          : 'добро пожаловать в экосистему hz'}
      </motion.h1>

      <motion.button
        onClick={handleStart}
        className="w-full md:w-64 h-16 border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center lowercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        начать
      </motion.button>
    </section>
  )
}

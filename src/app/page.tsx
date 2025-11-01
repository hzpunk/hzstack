'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'
import { Button } from '@/shared'

export default function Home() {
  const router = useRouter()

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.main
      className={styles.main}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div className={styles.text_h1} variants={itemVariants}>
        Добро пожаловать в экосистему HZ
      </motion.div>
      <motion.div className={styles.text_h2} variants={itemVariants}>
        Мы рады видеть вас!
      </motion.div>
      <motion.div className={styles.text_text} variants={itemVariants}>
        Начните с создания проекта
      </motion.div>
      <motion.div variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            text="Создать проект"
            onClick={() => router.push('/examples')}
          />
        </motion.div>
      </motion.div>
    </motion.main>
  )
}


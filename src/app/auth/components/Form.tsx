"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import styles from './Form.module.scss'
import { Button } from '@/shared'
import { useAuthStore } from '@/stores/authStore'
import {
  loginSchema,
  registerStep1Schema,
  registerStep2Schema,
  type LoginFormData,
  type RegisterStep1FormData,
  type RegisterStep2FormData,
} from '@/lib/schemas/authSchema'

export const Form = () => {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Форма для входа
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Форма для первого шага регистрации
  const registerStep1Form = useForm<RegisterStep1FormData>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Форма для второго шага регистрации
  const registerStep2Form = useForm<RegisterStep2FormData>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      name: '',
      date_of_birth: '',
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        loginForm.setError('root', { message: err.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep1 = async (data: RegisterStep1FormData) => {
    setStep(2)
  }

  const handleRegisterStep2 = async (data: RegisterStep2FormData) => {
    setIsLoading(true)
    try {
      const step1Data = registerStep1Form.getValues()
      await register(
        step1Data.email,
        step1Data.password,
        data.name,
        data.date_of_birth
      )
      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        registerStep2Form.setError('root', { message: err.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setStep(1)
    loginForm.reset()
    registerStep1Form.reset()
    registerStep2Form.reset()
  }

  // Анимация для перехода между шагами
  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  // Первый шаг - email и password
  if (step === 1) {
    const form = isLogin ? loginForm : registerStep1Form
    const onSubmit = isLogin ? handleLogin : handleRegisterStep1

    return (
      <AnimatePresence mode="wait">
        <motion.form
          key={isLogin ? 'login' : 'register-step1'}
          onSubmit={form.handleSubmit(onSubmit)}
          className={styles.form}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={stepVariants}
          transition={{ duration: 0.3 }}
        >
          <label className={styles.case}>
            <div className={styles.text_h2}>
              {isLogin ? 'Вход' : 'Регистрация'}
            </div>
          </label>

          {form.formState.errors.root && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {form.formState.errors.root.message}
            </motion.div>
          )}

          <label className={styles.case}>
            <div className={styles.text_text}>Email</div>
            <input
              className={styles.input}
              type="email"
              {...form.register('email')}
              disabled={isLoading}
              placeholder="your@email.com"
            />
            {form.formState.errors.email && (
              <motion.div
                className={styles.fieldError}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {form.formState.errors.email.message}
              </motion.div>
            )}
          </label>

          <label className={styles.case}>
            <div className={styles.text_text}>Пароль</div>
            <input
              className={styles.input}
              type="password"
              {...form.register('password')}
              disabled={isLoading}
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <motion.div
                className={styles.fieldError}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {form.formState.errors.password.message}
              </motion.div>
            )}
          </label>

          <motion.button
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              text={
                isLoading
                  ? 'Загрузка...'
                  : isLogin
                    ? 'Войти'
                    : 'Продолжить'
              }
            />
          </motion.button>

          <div className={styles.switchMode}>
            <button
              type="button"
              onClick={switchMode}
              className={styles.switchButton}
              disabled={isLoading}
            >
              {isLogin
                ? 'Нет аккаунта? Зарегистрироваться'
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </motion.form>
      </AnimatePresence>
    )
  }

  // Второй шаг - только для регистрации (дополнительные поля)
  return (
    <AnimatePresence>
      <motion.form
        key="register-step2"
        onSubmit={registerStep2Form.handleSubmit(handleRegisterStep2)}
        className={styles.form}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={stepVariants}
        transition={{ duration: 0.3 }}
      >
        <label className={styles.case}>
          <div className={styles.text_h2}>Завершение регистрации</div>
        </label>

        {registerStep2Form.formState.errors.root && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {registerStep2Form.formState.errors.root.message}
          </motion.div>
        )}

        <label className={styles.case}>
          <div className={styles.text_text}>Имя</div>
          <input
            className={styles.input}
            type="text"
            {...registerStep2Form.register('name')}
            disabled={isLoading}
            placeholder="Ваше имя"
          />
          {registerStep2Form.formState.errors.name && (
            <motion.div
              className={styles.fieldError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {registerStep2Form.formState.errors.name.message}
            </motion.div>
          )}
        </label>

        <label className={styles.case}>
          <div className={styles.text_text}>Дата рождения (необязательно)</div>
          <input
            className={styles.input}
            type="date"
            {...registerStep2Form.register('date_of_birth')}
            disabled={isLoading}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          {registerStep2Form.formState.errors.date_of_birth && (
            <motion.div
              className={styles.fieldError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {registerStep2Form.formState.errors.date_of_birth.message}
            </motion.div>
          )}
        </label>

        <motion.button
          type="submit"
          disabled={isLoading || registerStep2Form.formState.isSubmitting}
          className={styles.submitButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button text={isLoading ? 'Регистрация...' : 'Зарегистрироваться'} />
        </motion.button>

        <div className={styles.switchMode}>
          <button
            type="button"
            onClick={() => {
              setStep(1)
              registerStep2Form.reset()
            }}
            className={styles.switchButton}
            disabled={isLoading}
          >
            Назад
          </button>
        </div>
      </motion.form>
    </AnimatePresence>
  )
}

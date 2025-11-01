import { z } from 'zod'

// Схема для входа
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
})

// Схема для регистрации (первый шаг)
export const registerStep1Schema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z
    .string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ (@$!%*?&)'
    ),
})

// Схема для регистрации (второй шаг)
export const registerStep2Schema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть не менее 2 символов')
    .max(100, 'Имя не должно превышать 100 символов'),
  date_of_birth: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const date = new Date(val)
        const today = new Date()
        const age = today.getFullYear() - date.getFullYear()
        return age >= 13 && age <= 120
      },
      { message: 'Возраст должен быть от 13 до 120 лет' }
    ),
})

// Полная схема регистрации
export const registerSchema = registerStep1Schema.merge(registerStep2Schema)

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterStep1FormData = z.infer<typeof registerStep1Schema>
export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>
export type RegisterFormData = z.infer<typeof registerSchema>


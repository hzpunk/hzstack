export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export function getApiBaseUrl(): string {
  // В браузере используем переменную окружения
  if (typeof window !== 'undefined') {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!base) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not set. Please create .env.local file with NEXT_PUBLIC_API_BASE_URL=http://localhost:3001')
      // Fallback для разработки
      return 'http://localhost:3001'
    }
    return base.replace(/\/$/, '')
  }
  
  // На сервере используем переменную окружения или fallback
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  return base.replace(/\/$/, '')
}

// Формат ошибки от сервера:
// {
//   success: false,
//   error: string,
//   message?: string
// }

export interface ApiError {
  success: false
  error: string
  message?: string
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, { ...init, headers })
    
    // Получаем ответ как текст, чтобы проверить формат
    const text = await response.text()
    let data: any
    
    try {
      data = JSON.parse(text)
    } catch {
      // Если не JSON, значит это текстовая ошибка
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${text}`)
    }
    
    // Проверяем формат ответа сервера
    if (!response.ok) {
      // Сервер всегда возвращает { success: false, error: string, details?: [...] }
      const errorData = data as ApiError & { details?: Array<{ field: string; message: string }> }
      
      // Если есть детали ошибок валидации, форматируем их
      if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        const validationErrors = errorData.details.map(d => `${d.field}: ${d.message}`).join('\n')
        throw new Error(`${errorData.error || 'Validation failed'}\n${validationErrors}`)
      }
      
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }
    
    // Проверяем, что ответ имеет формат { success: true, data: ... }
    // или { success: true, ... } для некоторых endpoints
    if (data.success === false) {
      const errorData = data as ApiError & { details?: Array<{ field: string; message: string }> }
      
      // Если есть детали ошибок валидации, форматируем их
      if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        const validationErrors = errorData.details.map(d => `${d.field}: ${d.message}`).join('\n')
        throw new Error(`${errorData.error || 'Validation failed'}\n${validationErrors}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Unknown error')
    }
    
    return data as T
  } catch (error) {
    // Улучшенная обработка ошибок сети
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Не удалось подключиться к серверу. Проверьте:\n` +
        `1. Запущен ли backend сервер на ${baseUrl}\n` +
        `2. Правильно ли установлена переменная NEXT_PUBLIC_API_BASE_URL в .env.local\n` +
        `3. Нет ли проблем с CORS`
      )
    }
    // Пробрасываем остальные ошибки как есть
    throw error
  }
}


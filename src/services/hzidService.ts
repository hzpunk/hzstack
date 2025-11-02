/**
 * HZid API Service
 * 
 * Интеграция с HZid API (https://hzid.vercel.app/api)
 */

/**
 * Получить базовый URL для HZid API
 * В браузере используем Next.js API route как прокси для обхода CORS
 * На сервере можно использовать прямой URL
 */
export function getHzidApiUrl(): string {
  if (typeof window !== 'undefined') {
    // В браузере используем прокси через Next.js API route
    // Это обходит проблемы с CORS
    return '/api/hzid'
  }
  // На сервере можно использовать прямой URL (для SSR)
  return process.env.NEXT_PUBLIC_HZID_API_URL || 'https://hzid.vercel.app/api'
}

export interface HzidTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface HzidUser {
  id: string
  email: string
  username: string
  display_name: string | null
  avatar_url: string | null
  rank: string
  verified: boolean
}

export interface HzidUserProfile extends HzidUser {
  profile?: {
    id: string
    user_id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    rank: string
    trust_level: number
    verified: boolean
  }
  social_links?: any[]
  ecosystem?: any
}

export interface LoginResponse {
  success: true
  user: HzidUser
  tokens: HzidTokens
}

export interface SignupResponse {
  success: true
  message: string
  user: {
    id: string
    email: string
    username: string
  }
}

export interface RefreshResponse {
  success: true
  tokens: HzidTokens
}

export interface VerifyResponse {
  success: true
  valid: boolean
}

export interface UserMeResponse {
  success: true
  user: HzidUserProfile
}

export interface ApiError {
  success?: false
  error?: string
  message?: string
  resetTime?: number | string // Время сброса rate limit в миллисекундах
}

/**
 * Выполняет запрос к HZid API
 * @param skipToken - если true, не добавляет токен из localStorage (для проверки сессии через cookies)
 */
async function hzidFetch<T>(
  path: string,
  init: RequestInit = {},
  skipToken = false
): Promise<T> {
  const baseUrl = getHzidApiUrl()
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }

  // Добавляем access token если есть (и если не указано skipToken)
  if (!skipToken) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token && !headers.Authorization && !headers.authorization) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    credentials: 'include', // Важно для cookies (refresh_token)
    mode: 'cors', // Явно указываем CORS режим
  }

  try {
    const response = await fetch(url, fetchOptions)

    const text = await response.text()
    let data: any

    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${text}`)
    }

    if (!response.ok) {
      const errorData = data as ApiError
      
      // Обработка rate limit (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const remaining = response.headers.get('X-RateLimit-Remaining')
        const resetTimeHeader = response.headers.get('X-RateLimit-Reset')
        
        // Проверяем resetTime в теле ответа (может быть в миллисекундах)
        let resetTime: number | null = null
        if (errorData.resetTime) {
          resetTime = typeof errorData.resetTime === 'number' 
            ? errorData.resetTime 
            : parseInt(errorData.resetTime)
        } else if (resetTimeHeader) {
          resetTime = parseInt(resetTimeHeader) * 1000 // Конвертируем из секунд в миллисекунды
        }
        
        let message = 'Слишком много запросов к HZid API.\n\n'
        message += 'Лимиты запросов:\n'
        message += '- Регистрация: 5 запросов за 15 минут\n'
        message += '- Вход: 10 запросов за 15 минут\n'
        message += '- Обновление токена: 20 запросов за 15 минут\n'
        message += '- Получение данных пользователя: 100 запросов за 15 минут\n\n'
        
        if (retryAfter) {
          const seconds = parseInt(retryAfter)
          const minutes = Math.ceil(seconds / 60)
          if (minutes > 0) {
            message += `Попробуйте снова через ${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'}.`
          } else {
            message += `Попробуйте снова через ${seconds} ${seconds === 1 ? 'секунду' : seconds < 5 ? 'секунды' : 'секунд'}.`
          }
        } else if (resetTime) {
          const now = Date.now()
          const secondsLeft = Math.ceil((resetTime - now) / 1000)
          if (secondsLeft > 0) {
            const minutesLeft = Math.ceil(secondsLeft / 60)
            if (minutesLeft > 0) {
              message += `Попробуйте снова через ${minutesLeft} ${minutesLeft === 1 ? 'минуту' : minutesLeft < 5 ? 'минуты' : 'минут'}.`
            } else {
              message += `Попробуйте снова через ${secondsLeft} ${secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}.`
            }
          } else {
            message += 'Лимит скоро будет сброшен. Попробуйте через минуту.'
          }
        } else {
          message += 'Пожалуйста, подождите 15 минут перед следующей попыткой.'
        }
        
        if (remaining !== null) {
          message += `\nОсталось запросов: ${remaining}`
        }
        
        throw new Error(message)
      }
      
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    if (data.success === false) {
      const errorData = data as ApiError
      
      // Проверяем, не rate limit ли это в теле ответа
      const errorMsg = errorData.error || errorData.message || 'Unknown error'
      if (errorMsg.toLowerCase().includes('too many requests') || errorMsg.toLowerCase().includes('rate limit')) {
        throw new Error(
          'Слишком много запросов к HZid API.\n\n' +
          'Пожалуйста, подождите 15 минут перед следующей попыткой.\n\n' +
          'Лимиты:\n' +
          '- Регистрация: 5 запросов / 15 минут\n' +
          '- Вход: 10 запросов / 15 минут\n' +
          '- Обновление токена: 20 запросов / 15 минут\n' +
          '- Получение данных: 100 запросов / 15 минут'
        )
      }
      
      throw new Error(errorMsg)
    }

    return data as T
  } catch (error) {
    if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) {
      // Более детальная диагностика
      console.error('HZid API Error:', {
        url,
        baseUrl,
        envVar: process.env.NEXT_PUBLIC_HZID_API_URL || 'не установлена',
        error: error.message
      })
      
      throw new Error(
        `Не удалось подключиться к HZid API.\n\n` +
        `URL: ${url}\n` +
        `Переменная окружения: ${process.env.NEXT_PUBLIC_HZID_API_URL || 'не установлена'}\n` +
        `Используется: ${baseUrl}\n\n` +
        `Возможные причины:\n` +
        `1. Неверный URL или переменная NEXT_PUBLIC_HZID_API_URL\n` +
        `2. Проблемы с CORS (API должен разрешать запросы с вашего домена)\n` +
        `3. API недоступен или перегружен\n` +
        `4. Проблемы с сетью или файрволом\n\n` +
        `Проверьте консоль браузера (F12) для деталей ошибки CORS.`
      )
    }
    throw error
  }
}

/**
 * Вход через HZid
 */
export async function hzidLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await hzidFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  // Сохраняем токены
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.tokens.access_token)
    // refresh_token хранится в cookie, но также сохраняем в localStorage для совместимости
    if (response.tokens.refresh_token) {
      localStorage.setItem('refresh_token', response.tokens.refresh_token)
    }
  }

  return response
}

/**
 * Регистрация через HZid
 */
export async function hzidSignup(
  email: string,
  password: string,
  username: string,
  display_name?: string
): Promise<SignupResponse> {
  const response = await hzidFetch<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      username,
      display_name: display_name || username,
    }),
  })

  return response
}

/**
 * Обновление токена через HZid
 */
export async function hzidRefresh(): Promise<RefreshResponse> {
  const response = await hzidFetch<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    // refresh_token передается через cookie
  })

  // Обновляем токены
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.tokens.access_token)
    if (response.tokens.refresh_token) {
      localStorage.setItem('refresh_token', response.tokens.refresh_token)
    }
  }

  return response
}

/**
 * Проверка токена
 */
export async function hzidVerify(accessToken?: string): Promise<VerifyResponse> {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)
  
  if (!token) {
    throw new Error('No access token provided')
  }

  return hzidFetch<VerifyResponse>('/auth/verify', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Проверка активной сессии HZid через cookies
 * Возвращает данные пользователя если сессия активна, иначе null
 */
export async function checkHzidSession(): Promise<HzidUserProfile | null> {
  try {
    // Пробуем получить данные пользователя через cookies (без токена в header)
    // Если пользователь залогинен на HZid, cookies автоматически отправятся
    // skipToken = true означает не добавлять токен из localStorage
    const response = await hzidFetch<UserMeResponse>('/user/me', {
      method: 'GET',
    }, true) // skipToken = true - используем только cookies
    
    return response.user
  } catch (error) {
    // Если ошибка - значит сессии нет или она невалидная
    return null
  }
}

/**
 * Попытка получить токены через refresh из cookies
 * Если есть активная сессия HZid, получим новый токен
 */
export async function tryGetHzidTokenFromSession(): Promise<HzidTokens | null> {
  try {
    // Используем только cookies, не передаем токен в header
    const response = await hzidFetch<RefreshResponse>('/auth/refresh', {
      method: 'POST',
    }, true) // skipToken = true - используем только cookies
    
    return response.tokens
  } catch (error) {
    // Если ошибка - значит активной сессии нет
    return null
  }
}

/**
 * Выход через HZid
 */
export async function hzidLogout(): Promise<{ success: true; message: string }> {
  const response = await hzidFetch<{ success: true; message: string }>('/auth/logout', {
    method: 'POST',
    // access_token передается через cookie
  })

  // Очищаем токены из localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return response
}

// Кэш для данных пользователя (чтобы не делать лишние запросы)
let userCache: { user: HzidUserProfile; timestamp: number } | null = null
const USER_CACHE_TTL = 60000 // 1 минута

/**
 * Обменять HZid токен на локальный токен через локальный API
 * Это создаст/обновит пользователя в локальной БД
 */
export async function exchangeHzidTokenToLocal(hzidToken: string): Promise<{
  accessToken: string
  refreshToken: string
  user: {
    id: number
    hzid_user_id: string
    name: string
    email: string
    role: string
    email_verified: boolean
    auth_provider: string
  }
}> {
  console.log('[HZid] Exchange token: Starting exchange to local token')
  
  // Не пытаемся получить данные пользователя через /user/me
  // Серверный middleware использует данные из JWT токена напрямую
  // Это работает надежнее, так как /user/me требует cookies сессии
  console.log('[HZid] Exchange token: Using JWT token data directly (skipping /user/me)')
  const hzidUserData: HzidUserProfile | null = null
  
  const localApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  
  console.log('[HZid] Exchange token: Making request to local server', {
    url: `${localApiUrl}/api/hzid/exchange`,
    hasToken: !!hzidToken
  })
  
  // Серверный middleware использует данные из JWT токена, поэтому body не нужен
  const response = await fetch(`${localApiUrl}/api/hzid/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hzidToken}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('[HZid] Exchange token error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData.error || errorData.message,
      errorData
    })
    throw new Error(errorData.error || errorData.message || `Failed to exchange token (${response.status})`)
  }

  const data = await response.json()
  
  console.log('[HZid] Exchange token: Success', {
    userId: data.data.user.id,
    email: data.data.user.email,
    hzid_user_id: data.data.user.hzid_user_id,
    name: data.data.user.name,
  })
  
  // Данные уже синхронизированы при exchange, дополнительная синхронизация не нужна
  
  return data.data
}

/**
 * Получить текущего пользователя
 * Использует кэширование для уменьшения количества запросов
 */
export async function hzidGetMe(forceRefresh = false): Promise<HzidUserProfile> {
  console.log('[HZid] GetMe: Starting', { forceRefresh })
  
  // Проверяем кэш, если не требуется принудительное обновление
  if (!forceRefresh && userCache) {
    const now = Date.now()
    if (now - userCache.timestamp < USER_CACHE_TTL) {
      console.log('[HZid] GetMe: Using cached data', { email: userCache.user.email })
      return userCache.user
    }
  }

  try {
    const response = await hzidFetch<UserMeResponse>('/user/me')
    
    console.log('[HZid] GetMe: Success', {
      id: response.user.id,
      email: response.user.email,
      username: response.user.username,
      display_name: response.user.display_name,
    })
    
    // Обновляем кэш
    userCache = {
      user: response.user,
      timestamp: Date.now(),
    }
    return response.user
  } catch (error) {
    console.error('[HZid] GetMe: Error', error)
    // Если ошибка rate limit, возвращаем кэшированные данные если есть
    if (error instanceof Error && error.message.includes('Слишком много запросов')) {
      if (userCache) {
        console.warn('[HZid] GetMe: Rate limit reached, using cached user data')
        return userCache.user
      }
    }
    throw error
  }
}

/**
 * Очистить кэш пользователя
 */
export function clearUserCache(): void {
  userCache = null
}


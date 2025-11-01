import { apiFetch } from '@/lib/apiClient'

export interface AuthTokens {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name?: string
  date_of_birth?: string
  dob?: string
}

// Формат ответа сервера:
// {
//   success: boolean
//   message?: string
//   data: {
//     user: {...}
//     accessToken: string  (или access_token)
//     refreshToken?: string (или refresh_token)
//   }
// }

export interface AuthResponse {
  success: boolean
  message?: string
  data: {
    accessToken: string  // сервер возвращает camelCase
    refreshToken?: string
    user: {
      id: string | number
      email: string
      name?: string
      role?: string
      email_verified?: boolean
      created_at?: string
    }
  }
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const response = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  
  // Сервер возвращает accessToken и refreshToken в data (на одном уровне с user)
  const tokens: AuthTokens = {
    access_token: response.data.accessToken,
    refresh_token: response.data.refreshToken,
  }
  
  persistTokens(tokens)
  return tokens
}

export async function register(payload: RegisterPayload): Promise<AuthTokens> {
  // Normalize dob to date_of_birth for server
  const normalizedPayload: RegisterPayload = {
    ...payload,
    date_of_birth: payload.date_of_birth || payload.dob,
  }
  // Remove dob if date_of_birth is set to avoid duplicate
  if (normalizedPayload.date_of_birth) {
    delete normalizedPayload.dob
  }
  
  const response = await apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(normalizedPayload),
  })
  
  // Сервер возвращает accessToken и refreshToken в data (на одном уровне с user)
  const tokens: AuthTokens = {
    access_token: response.data.accessToken,
    refresh_token: response.data.refreshToken,
  }
  
  persistTokens(tokens)
  return tokens
}

export async function refresh(refreshToken?: string): Promise<AuthTokens> {
  const rt = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null)
  
  if (!rt) {
    throw new Error('No refresh token available')
  }
  
  // Сервер принимает refreshToken или refresh_token в теле запроса
  const response = await apiFetch<AuthResponse>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: rt, refresh_token: rt }),
  })
  
  const tokens: AuthTokens = {
    access_token: response.data.accessToken,
    refresh_token: response.data.refreshToken,
  }
  
  persistTokens(tokens)
  return tokens
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}

function persistTokens(tokens: AuthTokens) {
  if (typeof window !== 'undefined') {
    if (tokens.access_token) localStorage.setItem('access_token', tokens.access_token)
    if (tokens.refresh_token) localStorage.setItem('refresh_token', tokens.refresh_token)
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}


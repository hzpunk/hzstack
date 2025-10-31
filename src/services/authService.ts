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
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const tokens = await apiFetch<AuthTokens>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  persistTokens(tokens)
  return tokens
}

export async function register(payload: RegisterPayload): Promise<AuthTokens> {
  const tokens = await apiFetch<AuthTokens>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  persistTokens(tokens)
  return tokens
}

export async function refresh(refreshToken?: string): Promise<AuthTokens> {
  const rt = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null)
  const tokens = await apiFetch<AuthTokens>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: rt }),
  })
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

import { apiFetch } from '@/lib/apiClient'

export interface UserProfile {
  id: string
  email: string
  name?: string
  role?: string
}

export async function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/users/me')
}



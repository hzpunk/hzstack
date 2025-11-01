import { apiFetch } from '@/lib/apiClient'

export interface HzidExchangeResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken?: string
    user: {
      id: string
      email: string
      name?: string
      hzid_user_id: string
      auth_provider: 'hzid'
    }
  }
}

export async function exchangeHzidToken(hzidToken: string): Promise<HzidExchangeResponse['data']> {
  const response = await apiFetch<HzidExchangeResponse>('/api/hzid/exchange', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hzidToken}`,
    },
  })
  
  // Сохраняем токены
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.data.accessToken)
    if (response.data.refreshToken) {
      localStorage.setItem('refresh_token', response.data.refreshToken)
    }
  }
  
  return response.data
}


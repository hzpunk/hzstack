import { apiFetch } from '@/lib/apiClient'

export type HzidExchangeResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export async function exchangeHzidToken(hzidToken: string): Promise<HzidExchangeResponse> {
  return apiFetch<HzidExchangeResponse>('/api/hzid/exchange', {
    method: 'POST',
    body: JSON.stringify({ hzid_token: hzidToken })
  })
}



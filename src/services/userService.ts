import { apiFetch } from '@/lib/apiClient'

// Формат ответа сервера для /api/users/me:
// {
//   success: true,
//   data: {
//     id: number,
//     name: string,
//     email: string,
//     date_of_birth: string | null,
//     role: string,
//     phone: string | null,
//     address: string | null,
//     two_factor_enabled: boolean,
//     email_verified: boolean,
//     last_login: string | null,
//     created_at: string,
//     updated_at: string
//   }
// }

export interface UserProfile {
  id: string | number
  email: string
  name?: string | null
  date_of_birth?: string | null
  role?: string
  email_verified?: boolean
  phone?: string | null
  address?: string | null
  two_factor_enabled?: boolean
  last_login?: string | null
  created_at?: string
  updated_at?: string
}

export interface UserResponse {
  success: boolean
  data: UserProfile
}

export async function getMe(): Promise<UserProfile> {
  const response = await apiFetch<UserResponse>('/api/users/me')
  return response.data
}

// Сервер обновляет пользователя через PUT /api/users/:id
// Для обновления своего профиля используем PUT /api/users/:id с id текущего пользователя
export async function updateProfile(_userId: string | number, _data: Partial<UserProfile>): Promise<UserProfile>
export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile>
export async function updateProfile(userIdOrData: string | number | Partial<UserProfile>, data?: Partial<UserProfile>): Promise<UserProfile> {
  let userId: string | number
  let updateData: Partial<UserProfile>
  
  // Проверяем, переданы ли два аргумента или один
  if (typeof userIdOrData === 'string' || typeof userIdOrData === 'number') {
    // Два аргумента: userId и data
    userId = userIdOrData
    updateData = data || {}
  } else {
    // Один аргумент: только data, нужно получить id текущего пользователя
    updateData = userIdOrData
    const currentUser = await getMe()
    userId = currentUser.id
  }
  
  // Сервер принимает: name, email, role, phone, address
  // phone и address автоматически шифруются на сервере
  // Удаляем поля, которые не должны отправляться
  const { id: _id, created_at: _created_at, updated_at: _updated_at, ...cleanData } = updateData
  
  const response = await apiFetch<UserResponse>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(cleanData),
  })
  
  return response.data
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await apiFetch<{ success: boolean; message?: string }>('/api/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
}


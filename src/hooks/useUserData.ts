import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMe, updateProfile, type UserProfile } from '@/services/userService'

// Пример использования TanStack Query для получения данных пользователя
export function useUserData() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Пример использования TanStack Query для обновления профиля
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Обновляем кэш после успешного обновления
      queryClient.setQueryData(['user', 'me'], updatedProfile)
      // Можно также инвалидировать другие связанные запросы
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}


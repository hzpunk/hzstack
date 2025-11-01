import { create } from 'zustand'
import { login as apiLogin, register as apiRegister, logout as apiLogout, refresh as apiRefresh } from '@/services/authService'
import { getMe } from '@/services/userService'
import type { UserProfile } from '@/services/userService'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (_user: UserProfile | null) => void
  setToken: (_token: string | null) => void
  setLoading: (_loading: boolean) => void
  login: (_email: string, _password: string) => Promise<void>
  register: (_email: string, _password: string, _name?: string, _dob?: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  login: async (email, password) => {
    try {
      const tokens = await apiLogin({ email, password })
      set({ token: tokens.access_token })
      const me = await getMe()
      set({ user: me, isAuthenticated: true })
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false })
      throw error
    }
  },
  
  register: async (email, password, name, dob) => {
    try {
      const tokens = await apiRegister({ email, password, name, dob })
      set({ token: tokens.access_token })
      const me = await getMe()
      set({ user: me, isAuthenticated: true })
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false })
      throw error
    }
  },
  
  refresh: async () => {
    try {
      const tokens = await apiRefresh()
      set({ token: tokens.access_token })
    } catch (error) {
      // Если refresh не удался, разлогиниваем
      get().logout()
      throw error
    }
  },
  
  logout: () => {
    apiLogout()
    set({ user: null, token: null, isAuthenticated: false })
  },
  
  initialize: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      if (token) {
        set({ token })
        const me = await getMe()
        set({ user: me, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      // Если токен невалидный, очищаем
      apiLogout()
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))


import { create } from 'zustand'
import { login as apiLogin, register as apiRegister, logout as apiLogout, refresh as apiRefresh } from '@/services/authService'
import { getMe } from '@/services/userService'

interface AuthState {
  user: any
  session: string | null
  isLoading: boolean
  setUser: (user: any) => void
  setSession: (session: string | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  refresh: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  login: async (email, password) => {
    const tokens = await apiLogin({ email, password })
    set({ session: tokens.access_token })
    const me = await getMe()
    set({ user: me })
  },
  register: async (email, password, name) => {
    const tokens = await apiRegister({ email, password, name })
    set({ session: tokens.access_token })
    const me = await getMe()
    set({ user: me })
  },
  refresh: async () => {
    const tokens = await apiRefresh()
    set({ session: tokens.access_token })
  },
  logout: () => {
    apiLogout()
    set({ user: null, session: null })
  },
}))


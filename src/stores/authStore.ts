import { create } from 'zustand'
import { login as apiLogin, register as apiRegister, logout as apiLogout, refresh as apiRefresh } from '@/services/authService'
import { getMe } from '@/services/userService'
import { hzidGetMe, clearUserCache, checkHzidSession, tryGetHzidTokenFromSession, exchangeHzidTokenToLocal } from '@/services/hzidService'
import type { UserProfile } from '@/services/userService'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isHZidAuth: boolean // Флаг, что используется HZid аутентификация
  setUser: (_user: UserProfile | null) => void
  setToken: (_token: string | null, _isHZid?: boolean) => void
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
  isHZidAuth: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token, isHZid = false) => {
    set({ token, isHZidAuth: isHZid })
    // Сохраняем флаг в localStorage
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('is_hzid_auth', isHZid ? 'true' : 'false')
      } else {
        localStorage.removeItem('is_hzid_auth')
      }
    }
  },
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
      const tokens = await apiRegister({ 
        email, 
        password, 
        name,
        date_of_birth: dob,
        dob 
      })
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('is_hzid_auth')
    }
    // Очищаем кэш HZid пользователя при выходе
    clearUserCache()
    set({ user: null, token: null, isAuthenticated: false, isHZidAuth: false })
  },
  
  initialize: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      const isHZidAuth = typeof window !== 'undefined' 
        ? localStorage.getItem('is_hzid_auth') === 'true' 
        : false
      
      if (token) {
        set({ token, isHZidAuth })
        
        try {
          let me: UserProfile
          
          if (isHZidAuth) {
            // Если используется HZid токен, обмениваем на локальный и получаем данные из локальной БД
            console.log('[AuthStore] Initialize: HZid auth detected, exchanging token')
            
            try {
              // Обмениваем HZid токен на локальный (это создаст/обновит пользователя в БД)
              const exchangeResult = await exchangeHzidTokenToLocal(token)
              
              console.log('[AuthStore] Initialize: Token exchanged', {
                localUserId: exchangeResult.user.id,
                email: exchangeResult.user.email,
                hzid_user_id: exchangeResult.user.hzid_user_id,
              })
              
              // Сохраняем локальный токен
              setToken(exchangeResult.accessToken, false) // false = локальный токен
              localStorage.setItem('is_hzid_auth', 'false') // Теперь используем локальный токен
              
              // Получаем полные данные пользователя из локальной БД
              me = await getMe()
              
              console.log('[AuthStore] Initialize: User data from local DB', {
                id: me.id,
                email: me.email,
                name: me.name,
              })
            } catch (error) {
              console.error('[AuthStore] Initialize: Failed to exchange token', error)
              // Если обмен не удался, пробуем получить данные напрямую из HZid
              const hzidUser = await hzidGetMe()
              me = {
                id: hzidUser.id,
                email: hzidUser.email,
                name: hzidUser.display_name || hzidUser.username,
                username: hzidUser.username,
                display_name: hzidUser.display_name,
                avatar_url: hzidUser.avatar_url,
                verified: hzidUser.verified,
                email_verified: hzidUser.verified,
              }
            }
          } else {
            // Локальный токен - используем локальный API
            me = await getMe()
          }
          
          set({ user: me, isAuthenticated: true, isLoading: false })
        } catch (error) {
          // Если токен невалидный или API недоступен, пробуем другой метод
          console.error('Failed to get user data:', error)
          
          // Если не HZid токен и не получилось через локальный API, очищаем
          if (!isHZidAuth) {
            apiLogout()
            set({ user: null, token: null, isAuthenticated: false, isHZidAuth: false, isLoading: false })
          } else {
            // Для HZid токена просто не загружаем пользователя, но не очищаем токен
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        }
      } else {
        // Нет токена в localStorage - проверяем активную сессию HZid
        try {
          const hzidUser = await checkHzidSession()
          
          if (hzidUser) {
            console.log('[AuthStore] Initialize: Active HZid session found', {
              id: hzidUser.id,
              email: hzidUser.email,
              username: hzidUser.username,
            })
            
            // Пользователь уже залогинен на HZid - получаем токен и логиним
            const tokens = await tryGetHzidTokenFromSession()
            
            if (tokens) {
              console.log('[AuthStore] Initialize: Got tokens from session, exchanging to local')
              
              // Обмениваем HZid токен на локальный (создаст/обновит пользователя в БД)
              try {
                const exchangeResult = await exchangeHzidTokenToLocal(tokens.access_token)
                
                console.log('[AuthStore] Initialize: Token exchanged to local', {
                  localUserId: exchangeResult.user.id,
                  email: exchangeResult.user.email,
                  name: exchangeResult.user.name,
                })
                
                // Сохраняем локальный токен
                setToken(exchangeResult.accessToken, false)
                localStorage.setItem('is_hzid_auth', 'false')
                
                // Получаем полные данные из локальной БД
                const me = await getMe()
                
                console.log('[AuthStore] Initialize: User data from local DB', {
                  id: me.id,
                  email: me.email,
                  name: me.name,
                  phone: me.phone,
                  address: me.address,
                })
                
                set({ user: me, isAuthenticated: true, isLoading: false })
                return
              } catch (error) {
                console.error('[AuthStore] Initialize: Failed to exchange token', error)
                // Если обмен не удался, используем данные из HZid напрямую
                const me: UserProfile = {
                  id: hzidUser.id,
                  email: hzidUser.email,
                  name: hzidUser.display_name || hzidUser.username,
                  username: hzidUser.username,
                  display_name: hzidUser.display_name,
                  avatar_url: hzidUser.avatar_url,
                  verified: hzidUser.verified,
                  email_verified: hzidUser.verified,
                }
                setToken(tokens.access_token, true)
                set({ user: me, isAuthenticated: true, isLoading: false })
                return
              }
            }
          }
        } catch (error) {
          // Если проверка сессии не удалась - это нормально, просто продолжаем
          console.log('No active HZid session:', error)
        }
        
        set({ isLoading: false })
      }
    } catch (error) {
      // Если токен невалидный, очищаем
      apiLogout()
      set({ user: null, token: null, isAuthenticated: false, isHZidAuth: false, isLoading: false })
    }
  },
}))


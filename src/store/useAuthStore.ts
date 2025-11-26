import { create } from 'zustand';

interface User {
  firstName: string;
  lastName: string;
  role: string;
  roles: string[];
  phone?: string;
  email?: string;
  avatar?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => set({ isAuthenticated: true, user }),

  logout: () => set({ isAuthenticated: false, user: null }),

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        set({ isAuthenticated: false, user: null })
        return
      }
      const { user } = await res.json()
      if (user) {
        set({
          isAuthenticated: true,
          user: {
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
            role: user.profile?.role || (user.isAdmin ? 'admin' : 'user'),
            roles: user.roles || [],
            phone: user.profile?.phone || '',
            email: user.email || '',
            avatar: user.profile?.avatar || null,
          },
        })
      } else {
        set({ isAuthenticated: false, user: null })
      }
    } catch {
      set({ isAuthenticated: false, user: null })
    }
  },
}));

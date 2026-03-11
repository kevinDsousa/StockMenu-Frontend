import { create } from 'zustand'

type UserRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAITER'

export interface AuthUser {
  userId: string
  email: string
  companyId: string | null
  role: UserRole
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))


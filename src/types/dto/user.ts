import type { User } from '@/entities'

export interface CreateUserDto {
  companyId: string | null
  email: string
  name: string
  password: string
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAITER'
  active?: boolean
}

export interface UpdateUserDto {
  email?: string
  name?: string
  password?: string
  role?: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAITER'
  active?: boolean
}

export type UserListResponse = User[]


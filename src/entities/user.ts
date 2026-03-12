export type UserRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAITER'

export interface User {
  id: string
  companyId: string | null
  email: string
  name: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}


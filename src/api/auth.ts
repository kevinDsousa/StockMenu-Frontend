import { apiClient } from './client'

export interface LoginRequestDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  token: string
  userId: string
  email: string
  companyId: string | null
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'WAITER'
}

export async function login(request: LoginRequestDto) {
  const { data } = await apiClient.post<{
    data: LoginResponseDto
    message: string
    status: number
    errors?: string[]
  }>('/auth/login', request)

  return data
}


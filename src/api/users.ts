import type { User } from '@/entities'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getUsersByCompany(companyId: string): Promise<User[]> {
  const { data } = await apiClient.get<ApiResponse<User[]> | User[]>(`/user/company/${companyId}`)
  return unwrapApiData(data ?? [])
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User> | User>('/user', dto)
  return unwrapApiData(data!)
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User> | User>(`/user/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/user/${id}`)
}


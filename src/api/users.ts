import type { User } from '@/entities'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto'
import { apiClient } from './client'

export async function getUsersByCompany(companyId: string): Promise<User[]> {
  const { data } = await apiClient.get<User[]>(`/user/company/${companyId}`)
  return data
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const { data } = await apiClient.post<User>('/user', dto)
  return data
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  const { data } = await apiClient.put<User>(`/user/${id}`, dto)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/user/${id}`)
}


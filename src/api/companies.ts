import type { Company } from '@/entities'
import type { CreateCompanyDto, UpdateCompanyDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getCompanies(): Promise<Company[]> {
  const { data } = await apiClient.get<ApiResponse<Company[]> | Company[]>('/company')
  return unwrapApiData(data ?? [])
}

export async function getCompanyById(id: string): Promise<Company> {
  const { data } = await apiClient.get<ApiResponse<Company> | Company>(`/company/${id}`)
  return unwrapApiData(data!)
}

export async function createCompany(dto: CreateCompanyDto): Promise<Company> {
  const { data } = await apiClient.post<ApiResponse<Company> | Company>('/company', dto)
  return unwrapApiData(data!)
}

export async function updateCompany(id: string, dto: UpdateCompanyDto): Promise<Company> {
  const { data } = await apiClient.put<ApiResponse<Company> | Company>(`/company/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deleteCompany(id: string): Promise<void> {
  await apiClient.delete(`/company/${id}`)
}

import type { Company } from '@/entities'
import type { CreateCompanyDto, UpdateCompanyDto } from '@/types/dto'
import { apiClient } from './client'

export async function getCompanies(): Promise<Company[]> {
  const { data } = await apiClient.get<Company[]>('/companies')
  return data
}

export async function getCompanyById(id: string): Promise<Company> {
  const { data } = await apiClient.get<Company>(`/companies/${id}`)
  return data
}

export async function createCompany(dto: CreateCompanyDto): Promise<Company> {
  const { data } = await apiClient.post<Company>('/companies', dto)
  return data
}

export async function updateCompany(id: string, dto: UpdateCompanyDto): Promise<Company> {
  const { data } = await apiClient.patch<Company>(`/companies/${id}`, dto)
  return data
}

export async function deleteCompany(id: string): Promise<void> {
  await apiClient.delete(`/companies/${id}`)
}

import type { PrimaryProduct } from '@/entities'
import type { CreatePrimaryProductDto, UpdatePrimaryProductDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getPrimaryProducts(companyId?: string): Promise<PrimaryProduct[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<PrimaryProduct[]> | PrimaryProduct[]>('/primaryProduct', { params })
  return unwrapApiData(data ?? [])
}

export async function getPrimaryProductById(id: string): Promise<PrimaryProduct> {
  const { data } = await apiClient.get<ApiResponse<PrimaryProduct> | PrimaryProduct>(`/primaryProduct/${id}`)
  return unwrapApiData(data!)
}

export async function createPrimaryProduct(dto: CreatePrimaryProductDto): Promise<PrimaryProduct> {
  const { data } = await apiClient.post<ApiResponse<PrimaryProduct> | PrimaryProduct>('/primaryProduct', dto)
  return unwrapApiData(data!)
}

export async function updatePrimaryProduct(id: string, dto: UpdatePrimaryProductDto): Promise<PrimaryProduct> {
  const { data } = await apiClient.put<ApiResponse<PrimaryProduct> | PrimaryProduct>(`/primaryProduct/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deletePrimaryProduct(id: string): Promise<void> {
  await apiClient.delete(`/primaryProduct/${id}`)
}

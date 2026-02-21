import type { PrimaryProduct } from '@/entities'
import type { CreatePrimaryProductDto, UpdatePrimaryProductDto } from '@/types/dto'
import { apiClient } from './client'

export async function getPrimaryProducts(companyId?: string): Promise<PrimaryProduct[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<PrimaryProduct[]>('/primary-products', { params })
  return data
}

export async function getPrimaryProductById(id: string): Promise<PrimaryProduct> {
  const { data } = await apiClient.get<PrimaryProduct>(`/primary-products/${id}`)
  return data
}

export async function createPrimaryProduct(dto: CreatePrimaryProductDto): Promise<PrimaryProduct> {
  const { data } = await apiClient.post<PrimaryProduct>('/primary-products', dto)
  return data
}

export async function updatePrimaryProduct(id: string, dto: UpdatePrimaryProductDto): Promise<PrimaryProduct> {
  const { data } = await apiClient.patch<PrimaryProduct>(`/primary-products/${id}`, dto)
  return data
}

export async function deletePrimaryProduct(id: string): Promise<void> {
  await apiClient.delete(`/primary-products/${id}`)
}

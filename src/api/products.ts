import type { Product } from '@/entities'
import type { CreateProductDto, UpdateProductDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getProducts(companyId?: string): Promise<Product[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<Product[]> | Product[]>('/product', { params })
  return unwrapApiData(data ?? [])
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<ApiResponse<Product> | Product>(`/product/${id}`)
  return unwrapApiData(data!)
}

function toProductRequestBody(
  dto: CreateProductDto | UpdateProductDto
): Record<string, unknown> {
  const { isFractional, ...rest } = dto
  return { ...rest, fractional: isFractional ?? false }
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const body = toProductRequestBody(dto)
  const { data } = await apiClient.post<ApiResponse<Product> | Product>('/product', body)
  return unwrapApiData(data!)
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  const body = toProductRequestBody(dto)
  const { data } = await apiClient.put<ApiResponse<Product> | Product>(`/product/${id}`, body)
  return unwrapApiData(data!)
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/product/${id}`)
}

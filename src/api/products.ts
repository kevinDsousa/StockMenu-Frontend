import type { Product } from '@/entities'
import type { CreateProductDto, UpdateProductDto } from '@/types/dto'
import { apiClient } from './client'

export async function getProducts(companyId?: string): Promise<Product[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<Product[]>('/products', { params })
  return data
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', dto)
  return data
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, dto)
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}

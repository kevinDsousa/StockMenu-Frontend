import type { Order } from '@/entities'
import type { CreateOrderDto, UpdateOrderDto } from '@/types/dto'
import { apiClient } from './client'

export async function getOrders(companyId?: string): Promise<Order[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<Order[]>('/orders', { params })
  return data
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`)
  return data
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', dto)
  return data
}

export async function updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, dto)
  return data
}

export async function deleteOrder(id: string): Promise<void> {
  await apiClient.delete(`/orders/${id}`)
}

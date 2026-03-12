import type { Order } from '@/entities'
import type { CreateOrderDto, UpdateOrderDto, OrderTransferDto } from '@/types/dto'
import { apiClient } from './client'

export async function getOrders(companyId?: string): Promise<Order[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<Order[]>('/order', { params })
  return data
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/order/${id}`)
  return data
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<Order>('/order', dto)
  return data
}

export async function updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/order/${id}`, dto)
  return data
}

export async function deleteOrder(id: string): Promise<void> {
  await apiClient.delete(`/order/${id}`)
}

export async function transferOrder(dto: OrderTransferDto): Promise<Order> {
  const { data } = await apiClient.post<Order>('/order/transfer', dto)
  return data
}

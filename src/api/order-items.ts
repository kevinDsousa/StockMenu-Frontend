import type { OrderItem } from '@/entities'
import type { CreateOrderItemDto, UpdateOrderItemDto } from '@/types/dto'
import { apiClient } from './client'

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data } = await apiClient.get<OrderItem[]>(`/orders/${orderId}/items`)
  return data
}

export async function getOrderItemById(orderId: string, id: string): Promise<OrderItem> {
  const { data } = await apiClient.get<OrderItem>(`/orders/${orderId}/items/${id}`)
  return data
}

export async function createOrderItem(dto: CreateOrderItemDto): Promise<OrderItem> {
  const { data } = await apiClient.post<OrderItem>('/orderItem', dto)
  return data
}

export async function updateOrderItem(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
  const { data } = await apiClient.patch<OrderItem>(`/orderItem/${id}`, dto)
  return data
}

export async function deleteOrderItem(id: string): Promise<void> {
  await apiClient.delete(`/orderItem/${id}`)
}

export async function cancelOrderItem(id: string): Promise<OrderItem> {
  const { data } = await apiClient.patch<OrderItem>(`/orderItem/${id}/cancel`)
  return data
}

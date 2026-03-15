import type { OrderItem } from '@/entities'
import type { CreateOrderItemDto, UpdateOrderItemDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data } = await apiClient.get<ApiResponse<OrderItem[]> | OrderItem[]>('/orderItem', { params: { orderId } })
  return unwrapApiData(data ?? [])
}

export async function getOrderItemById(id: string): Promise<OrderItem> {
  const { data } = await apiClient.get<ApiResponse<OrderItem> | OrderItem>(`/orderItem/${id}`)
  return unwrapApiData(data!)
}

export async function createOrderItem(dto: CreateOrderItemDto): Promise<OrderItem> {
  const { data } = await apiClient.post<ApiResponse<OrderItem> | OrderItem>('/orderItem', dto)
  return unwrapApiData(data!)
}

export async function updateOrderItem(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
  const { data } = await apiClient.put<ApiResponse<OrderItem> | OrderItem>(`/orderItem/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deleteOrderItem(id: string): Promise<void> {
  await apiClient.delete(`/orderItem/${id}`)
}

export async function cancelOrderItem(id: string): Promise<OrderItem> {
  const { data } = await apiClient.patch<ApiResponse<OrderItem> | OrderItem>(`/orderItem/${id}/cancel`)
  return unwrapApiData(data!)
}

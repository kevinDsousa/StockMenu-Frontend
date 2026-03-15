import type { Order } from '@/entities'
import type { CreateOrderDto, UpdateOrderDto, OrderTransferDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getOrders(companyId?: string): Promise<Order[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<Order[]> | Order[]>('/order', { params })
  return unwrapApiData(data ?? [])
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await apiClient.get<ApiResponse<Order> | Order>(`/order/${id}`)
  return unwrapApiData(data!)
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<ApiResponse<Order> | Order>('/order', dto)
  return unwrapApiData(data!)
}

export async function updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
  const { data } = await apiClient.put<ApiResponse<Order> | Order>(`/order/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deleteOrder(id: string): Promise<void> {
  await apiClient.delete(`/order/${id}`)
}

export async function transferOrder(dto: OrderTransferDto): Promise<Order> {
  const { data } = await apiClient.post<ApiResponse<Order> | Order>('/order/transfer', dto)
  return unwrapApiData(data!)
}

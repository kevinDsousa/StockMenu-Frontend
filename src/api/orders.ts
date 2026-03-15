import type { Order } from '@/entities'
import type { CreateOrderDto, UpdateOrderDto, OrderTransferDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import type { PagedResponse } from '@/types/pagination'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export interface OrdersPageParams {
  page: number
  size: number
  tableSearch?: string
  customerSearch?: string
  itemSearch?: string
}

export async function getOrders(companyId?: string): Promise<Order[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<Order[]> | Order[]>('/order', { params })
  return unwrapApiData(data ?? [])
}

export async function getOrdersPage(
  companyId: string,
  params: OrdersPageParams
): Promise<PagedResponse<Order>> {
  const { data } = await apiClient.get<ApiResponse<PagedResponse<Order>>>('/order/page', {
    params: {
      companyId,
      page: params.page,
      size: params.size,
      tableSearch: params.tableSearch ?? undefined,
      customerSearch: params.customerSearch ?? undefined,
      itemSearch: params.itemSearch ?? undefined,
    },
  })
  return unwrapApiData(data!)
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

export async function closeOrdersBatch(orderIds: string[], tableId?: string): Promise<void> {
  if (orderIds.length === 0) return
  await apiClient.post('/order/close-batch', { orderIds, tableId })
}

import type { OrderItem } from '@/entities'

export interface CreateOrderItemDto {
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customerName?: string | null
  observation?: string | null
  status?: string
}

export interface UpdateOrderItemDto {
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  customerName?: string | null
  observation?: string | null
  status?: string
}

export type OrderItemListResponse = OrderItem[]

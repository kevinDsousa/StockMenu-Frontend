import type { Order } from '@/entities'

export interface CreateOrderDto {
  companyId: string
  tableId?: string | null
  paymentMethodId?: string | null
  type: string
  customerName?: string | null
  deliveryAddress?: string | null
  totalAmount?: number
  invoiced?: boolean
}

export interface UpdateOrderDto {
  tableId?: string | null
  paymentMethodId?: string | null
  type?: string
  customerName?: string | null
  deliveryAddress?: string | null
  totalAmount?: number
  invoiced?: boolean
}

export type OrderListResponse = Order[]

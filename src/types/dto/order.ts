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
  items: Array<{ productId: string; quantity: number; customerName?: string | null; observation?: string | null }>
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

export interface OrderTransferDto {
  orderId: string
  targetTableId: string
}

export type OrderListResponse = Order[]

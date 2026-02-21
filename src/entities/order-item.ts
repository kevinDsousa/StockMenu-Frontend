export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customerName: string | null
  observation: string | null
  status: string
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

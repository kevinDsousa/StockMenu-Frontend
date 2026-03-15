export interface Order {
  id: string
  companyId: string
  tableId: string | null
  tableNumber: number | null
  createdByUserId: string | null
  createdByUserName: string | null
  paymentMethodId: string | null
  type: string
  customerName: string | null
  deliveryAddress: string | null
  totalAmount: number
  invoiced: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

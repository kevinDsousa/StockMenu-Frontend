export interface PaymentHistory {
  id: string
  companyId: string
  venueTableId: string | null
  tableNumber: number
  totalAmount: number
  closedAt: string
  closedByUserId: string | null
  closedByUserName: string | null
  paymentMethodId: string | null
  paymentMethodName: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

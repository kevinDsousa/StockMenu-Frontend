export interface PaymentMethod {
  id: string
  companyId: string
  name: string
  active: boolean
  allowsDelivery: boolean
  isOnlinePayment: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

import type { PaymentMethod } from '@/entities'

export interface CreatePaymentMethodDto {
  companyId: string
  name: string
  active?: boolean
  allowsDelivery?: boolean
  isOnlinePayment?: boolean
}

export interface UpdatePaymentMethodDto {
  name?: string
  active?: boolean
  allowsDelivery?: boolean
  isOnlinePayment?: boolean
}

export type PaymentMethodListResponse = PaymentMethod[]

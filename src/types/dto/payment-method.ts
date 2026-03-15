import type { PaymentMethod } from '@/entities'

export interface CreatePaymentMethodDto {
  companyId: string
  name: string
  active?: boolean
  allowsDelivery?: boolean
  onlinePayment?: boolean
}

export interface UpdatePaymentMethodDto {
  companyId: string
  name?: string
  active?: boolean
  allowsDelivery?: boolean
  onlinePayment?: boolean
}

export type PaymentMethodListResponse = PaymentMethod[]

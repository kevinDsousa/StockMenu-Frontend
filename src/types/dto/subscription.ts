import type { Subscription } from '@/entities'

export interface CreateSubscriptionDto {
  companyId: string
  startDate: string
  endDate: string
  status: string
  amountPaid: number
}

export interface UpdateSubscriptionDto {
  startDate?: string
  endDate?: string
  status?: string
  amountPaid?: number
}

export type SubscriptionListResponse = Subscription[]

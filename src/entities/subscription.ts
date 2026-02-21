export interface Subscription {
  id: string
  companyId: string
  startDate: string
  endDate: string
  status: string
  amountPaid: number
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

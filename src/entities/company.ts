export interface Company {
  id: string
  tradeName: string
  corporateName: string | null
  cnpj: string
  whatsapp: string | null
  active: boolean
  maxWaiters: number | null
  stockExpiringDays: number | null
  canOperate: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

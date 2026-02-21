import type { PrimaryProduct } from '@/entities'

export interface CreatePrimaryProductDto {
  companyId: string
  name: string
  currentStock?: number
  unit: string
  lowStockAlert?: number | null
  expirationDate: string
  productType?: string | null
}

export interface UpdatePrimaryProductDto {
  name?: string
  currentStock?: number
  unit?: string
  lowStockAlert?: number | null
  expirationDate?: string
  productType?: string | null
}

export type PrimaryProductListResponse = PrimaryProduct[]

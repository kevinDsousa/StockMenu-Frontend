import type { PrimaryProduct } from '@/entities'

export interface CreatePrimaryProductDto {
  companyId: string
  name: string
  currentStock?: number
  unit: string
  lowStockAlert?: number | null
  expirationDate: string
  productType?: string | null
  stockEntryDate?: string | null
  storageType?: string | null
  maxStorageDays?: number | null
  image?: string | null
  imageContentType?: string | null
}

export interface UpdatePrimaryProductDto {
  name?: string
  currentStock?: number
  unit?: string
  lowStockAlert?: number | null
  expirationDate?: string
  productType?: string | null
  stockEntryDate?: string | null
  storageType?: string | null
  maxStorageDays?: number | null
  image?: string | null
  imageContentType?: string | null
}

export const STORAGE_TYPE_LABELS: Record<string, string> = {
  FREEZER: 'Freezer',
  REFRIGERATED: 'Refrigerado',
  AMBIENT: 'Ambiente',
}

export type PrimaryProductListResponse = PrimaryProduct[]

export interface PrimaryProduct {
  id: string
  companyId: string
  name: string
  currentStock: number
  unit: string
  lowStockAlert: number | null
  expirationDate: string
  productType: string | null
  stockEntryDate: string | null
  storageType: string | null
  maxStorageDays: number | null
  isStockLow?: boolean
  isExpired?: boolean
  isExpiringSoon?: boolean
  imageUrl?: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

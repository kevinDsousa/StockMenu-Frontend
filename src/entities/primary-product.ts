export interface PrimaryProduct {
  id: string
  companyId: string
  name: string
  currentStock: number
  unit: string
  lowStockAlert: number | null
  expirationDate: string
  productType: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

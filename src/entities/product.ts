export interface Product {
  id: string
  companyId: string
  primaryProductId: string
  name: string
  price: number
  sellUnit: string
  isFractional: boolean
  customExpirationDate: string | null
  active: boolean
  effectiveExpirationDate?: string | null
  isExpired?: boolean
  stockLow?: boolean
  imageUrl?: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

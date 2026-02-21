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
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

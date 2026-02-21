import type { Product } from '@/entities'

export interface CreateProductDto {
  companyId: string
  primaryProductId: string
  name: string
  price: number
  sellUnit: string
  isFractional?: boolean
  customExpirationDate?: string | null
  active?: boolean
}

export interface UpdateProductDto {
  primaryProductId?: string
  name?: string
  price?: number
  sellUnit?: string
  isFractional?: boolean
  customExpirationDate?: string | null
  active?: boolean
}

export type ProductListResponse = Product[]

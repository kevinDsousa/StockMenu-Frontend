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
  image?: string | null
  imageContentType?: string | null
}

export interface UpdateProductDto {
  primaryProductId?: string
  name?: string
  price?: number
  sellUnit?: string
  isFractional?: boolean
  customExpirationDate?: string | null
  active?: boolean
  image?: string | null
  imageContentType?: string | null
}

export type ProductListResponse = Product[]

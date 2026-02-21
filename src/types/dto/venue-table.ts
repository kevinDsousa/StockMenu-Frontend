import type { VenueTable } from '@/entities'

export interface CreateVenueTableDto {
  companyId: string
  tableNumber: number
  capacity?: number | null
  status?: string
  isActive?: boolean
}

export interface UpdateVenueTableDto {
  tableNumber?: number
  capacity?: number | null
  status?: string
  isActive?: boolean
}

export type VenueTableListResponse = VenueTable[]

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

export interface VenueTableSplitTargetDto {
  tableNumber: number
  capacity?: number | null
  orderIds: string[]
}

export interface VenueTableSplitDto {
  targets: VenueTableSplitTargetDto[]
}

export interface VenueTableMergeDto {
  companyId: string
  sourceTableIds: string[]
  targetTableId?: string | null
}

export type VenueTableListResponse = VenueTable[]

import type { VenueTable } from '@/entities'
import type { CreateVenueTableDto, UpdateVenueTableDto, VenueTableMergeDto, VenueTableSplitDto } from '@/types/dto'
import { apiClient } from './client'

export async function getVenueTables(companyId?: string): Promise<VenueTable[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<VenueTable[]>('/venueTable', { params })
  return data
}

export async function createVenueTable(dto: CreateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.post<VenueTable>('/venueTable', dto)
  return data
}

export async function updateVenueTable(id: string, dto: UpdateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.put<VenueTable>(`/venueTable/${id}`, dto)
  return data
}

export async function deleteVenueTable(id: string): Promise<void> {
  await apiClient.delete(`/venueTable/${id}`)
}

export async function splitVenueTable(id: string, dto: VenueTableSplitDto): Promise<VenueTable> {
  const { data } = await apiClient.post<VenueTable>(`/venueTable/${id}/split`, dto)
  return data
}

export async function mergeVenueTables(dto: VenueTableMergeDto): Promise<VenueTable> {
  const { data } = await apiClient.post<VenueTable>('/venueTable/merge', dto)
  return data
}


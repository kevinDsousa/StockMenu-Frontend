import type { VenueTable } from '@/entities'
import type { CreateVenueTableDto, UpdateVenueTableDto } from '@/types/dto'
import { apiClient } from './client'

export async function getVenueTables(companyId?: string): Promise<VenueTable[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<VenueTable[]>('/venue-tables', { params })
  return data
}

export async function getVenueTableById(id: string): Promise<VenueTable> {
  const { data } = await apiClient.get<VenueTable>(`/venue-tables/${id}`)
  return data
}

export async function createVenueTable(dto: CreateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.post<VenueTable>('/venue-tables', dto)
  return data
}

export async function updateVenueTable(id: string, dto: UpdateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.patch<VenueTable>(`/venue-tables/${id}`, dto)
  return data
}

export async function deleteVenueTable(id: string): Promise<void> {
  await apiClient.delete(`/venue-tables/${id}`)
}

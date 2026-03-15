import type { VenueTable } from '@/entities'
import type { CreateVenueTableDto, UpdateVenueTableDto, VenueTableMergeDto, VenueTableSplitDto } from '@/types/dto'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getVenueTables(companyId?: string): Promise<VenueTable[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<VenueTable[]> | VenueTable[]>('/venueTable', { params })
  return unwrapApiData(data ?? [])
}

export async function createVenueTable(dto: CreateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.post<ApiResponse<VenueTable> | VenueTable>('/venueTable', dto)
  return unwrapApiData(data!)
}

export async function updateVenueTable(id: string, dto: UpdateVenueTableDto): Promise<VenueTable> {
  const { data } = await apiClient.put<ApiResponse<VenueTable> | VenueTable>(`/venueTable/${id}`, dto)
  return unwrapApiData(data!)
}

export async function deleteVenueTable(id: string): Promise<void> {
  await apiClient.delete(`/venueTable/${id}`)
}

export async function splitVenueTable(id: string, dto: VenueTableSplitDto): Promise<VenueTable> {
  const { data } = await apiClient.post<ApiResponse<VenueTable> | VenueTable>(`/venueTable/${id}/split`, dto)
  return unwrapApiData(data!)
}

export async function mergeVenueTables(dto: VenueTableMergeDto): Promise<VenueTable> {
  const { data } = await apiClient.post<ApiResponse<VenueTable> | VenueTable>('/venueTable/merge', dto)
  return unwrapApiData(data!)
}

export async function updateVenueTableStatus(id: string, status: string): Promise<VenueTable> {
  const { data } = await apiClient.patch<ApiResponse<VenueTable> | VenueTable>(`/venueTable/${id}/status`, { status })
  return unwrapApiData(data!)
}


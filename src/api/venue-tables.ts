import type { VenueTable } from '@/entities'
import { apiClient } from './client'

export async function getVenueTables(companyId?: string): Promise<VenueTable[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<VenueTable[]>('/venue-table', { params })
  return data
}


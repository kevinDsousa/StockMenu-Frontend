import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export interface EnumItem {
  key: string
  value: string
}

export async function getUnitMeasures(): Promise<EnumItem[]> {
  const { data } = await apiClient.get<ApiResponse<EnumItem[]> | EnumItem[]>('/enum/unitMeasure')
  const list = unwrapApiData(data ?? [])
  return Array.isArray(list) ? list : []
}

import { apiClient } from './client'

export interface EnumItem {
  key: string
  value: string
}

export async function getUnitMeasures(): Promise<EnumItem[]> {
  const { data } = await apiClient.get<{ data?: EnumItem[] }>('/enum/unitMeasure')
  const list = (data as any)?.data
  return Array.isArray(list) ? list : []
}

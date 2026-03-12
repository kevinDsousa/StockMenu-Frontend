import { apiClient } from './client'

export interface UnitMeasure {
  id: string
  key: string
  label: string
  active: boolean
}

export interface UnitMeasureCreateDto {
  key: string
  label: string
  active?: boolean
}

export interface UnitMeasureUpdateDto {
  key?: string
  label?: string
  active?: boolean
}

export async function getUnitMeasuresList(): Promise<UnitMeasure[]> {
  const { data } = await apiClient.get<{ data?: UnitMeasure[] }>('/unitMeasure')
  const list = (data as any)?.data
  return Array.isArray(list) ? list : []
}

export async function getUnitMeasureById(id: string): Promise<UnitMeasure> {
  const { data } = await apiClient.get<{ data?: UnitMeasure }>(`/unitMeasure/${id}`)
  return (data as any)?.data
}

export async function createUnitMeasure(dto: UnitMeasureCreateDto): Promise<UnitMeasure> {
  const { data } = await apiClient.post<{ data?: UnitMeasure }>('/unitMeasure', {
    key: dto.key.trim().toUpperCase(),
    label: dto.label.trim(),
    active: dto.active ?? true,
  })
  return (data as any)?.data
}

export async function updateUnitMeasure(id: string, dto: UnitMeasureUpdateDto): Promise<UnitMeasure> {
  const { data } = await apiClient.put<{ data?: UnitMeasure }>(`/unitMeasure/${id}`, {
    key: dto.key?.trim().toUpperCase(),
    label: dto.label?.trim(),
    active: dto.active,
  })
  return (data as any)?.data
}

export async function deleteUnitMeasure(id: string): Promise<void> {
  await apiClient.delete(`/unitMeasure/${id}`)
}

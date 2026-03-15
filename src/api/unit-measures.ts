import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
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
  const { data } = await apiClient.get<ApiResponse<UnitMeasure[]> | UnitMeasure[]>('/unitMeasure')
  const list = unwrapApiData(data ?? [])
  return Array.isArray(list) ? list : []
}

export async function getUnitMeasureById(id: string): Promise<UnitMeasure> {
  const { data } = await apiClient.get<ApiResponse<UnitMeasure> | UnitMeasure>(`/unitMeasure/${id}`)
  return unwrapApiData(data!)
}

export async function createUnitMeasure(dto: UnitMeasureCreateDto): Promise<UnitMeasure> {
  const { data } = await apiClient.post<ApiResponse<UnitMeasure> | UnitMeasure>('/unitMeasure', {
    key: dto.key.trim().toUpperCase(),
    label: dto.label.trim(),
    active: dto.active ?? true,
  })
  return unwrapApiData(data!)
}

export async function updateUnitMeasure(id: string, dto: UnitMeasureUpdateDto): Promise<UnitMeasure> {
  const { data } = await apiClient.put<ApiResponse<UnitMeasure> | UnitMeasure>(`/unitMeasure/${id}`, {
    key: dto.key?.trim().toUpperCase(),
    label: dto.label?.trim(),
    active: dto.active,
  })
  return unwrapApiData(data!)
}

export async function deleteUnitMeasure(id: string): Promise<void> {
  await apiClient.delete(`/unitMeasure/${id}`)
}

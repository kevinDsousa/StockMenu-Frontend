import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUnitMeasures } from '@/api/enums'
import {
  createUnitMeasure,
  deleteUnitMeasure,
  getUnitMeasuresList,
  updateUnitMeasure,
} from '@/api/unit-measures'
import type { UnitMeasureCreateDto, UnitMeasureUpdateDto } from '@/api/unit-measures'

export const unitMeasureKeys = {
  list: ['unit-measures'] as const,
  enumList: ['enums', 'unitMeasure'] as const,
  detail: (id: string) => ['unit-measures', id] as const,
}

export function useUnitMeasures() {
  return useQuery({
    queryKey: unitMeasureKeys.enumList,
    queryFn: getUnitMeasures,
  })
}

export function useUnitMeasuresList() {
  return useQuery({
    queryKey: unitMeasureKeys.list,
    queryFn: getUnitMeasuresList,
  })
}

export function useCreateUnitMeasure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UnitMeasureCreateDto) => createUnitMeasure(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.list })
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.enumList })
    },
  })
}

export function useUpdateUnitMeasure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UnitMeasureUpdateDto }) =>
      updateUnitMeasure(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.list })
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.enumList })
    },
  })
}

export function useDeleteUnitMeasure() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUnitMeasure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.list })
      queryClient.invalidateQueries({ queryKey: unitMeasureKeys.enumList })
    },
  })
}

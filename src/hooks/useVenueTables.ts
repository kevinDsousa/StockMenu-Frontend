import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createVenueTable, deleteVenueTable, getVenueTables, mergeVenueTables, splitVenueTable, updateVenueTable } from '@/api/venue-tables'
import type { CreateVenueTableDto, UpdateVenueTableDto, VenueTableMergeDto, VenueTableSplitDto } from '@/types/dto'

const keys = {
  all: ['venue-tables'] as const,
  list: (companyId?: string) => [...keys.all, 'list', companyId] as const,
}

export function useVenueTables(companyId?: string) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => getVenueTables(companyId),
  })
}

export function useCreateVenueTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateVenueTableDto) => createVenueTable(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateVenueTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateVenueTableDto }) =>
      updateVenueTable(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useDeleteVenueTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVenueTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useSplitVenueTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: VenueTableSplitDto }) =>
      splitVenueTable(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useMergeVenueTables() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: VenueTableMergeDto) => mergeVenueTables(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}


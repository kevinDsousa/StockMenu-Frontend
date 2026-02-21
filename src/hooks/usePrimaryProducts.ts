import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as primaryProductsApi from '@/api/primary-products'
import type { CreatePrimaryProductDto, UpdatePrimaryProductDto } from '@/types/dto'

const keys = {
  all: ['primary-products'] as const,
  list: (companyId?: string) => [...keys.all, 'list', companyId] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function usePrimaryProducts(companyId?: string) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => primaryProductsApi.getPrimaryProducts(companyId),
  })
}

export function usePrimaryProduct(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => primaryProductsApi.getPrimaryProductById(id!),
    enabled: !!id,
  })
}

export function useCreatePrimaryProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreatePrimaryProductDto) => primaryProductsApi.createPrimaryProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdatePrimaryProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePrimaryProductDto }) =>
      primaryProductsApi.updatePrimaryProduct(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeletePrimaryProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => primaryProductsApi.deletePrimaryProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

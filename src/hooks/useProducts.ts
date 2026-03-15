import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as productsApi from '@/api/products'
import type { CreateProductDto, UpdateProductDto } from '@/types/dto'

const keys = {
  all: ['products'] as const,
  list: (companyId?: string) => [...keys.all, 'list', companyId] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useProducts(companyId?: string) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => productsApi.getProducts(companyId),
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProductDto) => productsApi.createProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      productsApi.updateProduct(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

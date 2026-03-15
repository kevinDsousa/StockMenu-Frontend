import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as orderItemsApi from '@/api/order-items'
import type { CreateOrderItemDto, UpdateOrderItemDto } from '@/types/dto'

const keys = {
  all: ['order-items'] as const,
  list: (orderId: string) => [...keys.all, 'list', orderId] as const,
  detail: (orderId: string, id: string) => [...keys.all, 'detail', orderId, id] as const,
}

export function useOrderItems(orderId: string | undefined) {
  return useQuery({
    queryKey: keys.list(orderId ?? ''),
    queryFn: () => orderItemsApi.getOrderItems(orderId!),
    enabled: !!orderId,
  })
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOrderItemDto) => orderItemsApi.createOrderItem(dto),
    onSuccess: (_data, dto) => {
      if (dto.orderId) {
        queryClient.invalidateQueries({ queryKey: keys.list(dto.orderId) })
        queryClient.invalidateQueries({ queryKey: ['orders', 'detail', dto.orderId] })
      }
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOrderItemDto }) =>
      orderItemsApi.updateOrderItem(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteOrderItem(orderId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => orderItemsApi.deleteOrderItem(id),
    onSuccess: () => {
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: keys.list(orderId) })
      }
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useCancelOrderItem(orderId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => orderItemsApi.cancelOrderItem(id),
    onSuccess: () => {
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: keys.list(orderId) })
        queryClient.invalidateQueries({ queryKey: ['orders', 'detail', orderId] })
      }
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}


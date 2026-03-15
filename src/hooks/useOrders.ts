import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as ordersApi from '@/api/orders'
import type { CreateOrderDto, UpdateOrderDto, OrderTransferDto } from '@/types/dto'
import { usePaginatedQuery } from './usePaginatedQuery'

const keys = {
  all: ['orders'] as const,
  list: (companyId?: string) => [...keys.all, 'list', companyId] as const,
  page: (
    companyId: string,
    page: number,
    size: number,
    filters: { tableSearch?: string; customerSearch?: string; itemSearch?: string }
  ) => [...keys.all, 'page', companyId, page, size, filters] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useOrders(companyId?: string) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => ordersApi.getOrders(companyId),
  })
}

export interface OrdersPageFilters {
  tableSearch?: string
  customerSearch?: string
  itemSearch?: string
}

export function useOrdersPage(
  companyId: string | undefined,
  params: { page: number; size: number } & OrdersPageFilters
) {
  return usePaginatedQuery({
    queryKey: keys.page(
      companyId ?? '',
      params.page,
      params.size,
      {
        tableSearch: params.tableSearch,
        customerSearch: params.customerSearch,
        itemSearch: params.itemSearch,
      }
    ),
    queryFn: (p) =>
      ordersApi.getOrdersPage(companyId!, {
        page: p.page,
        size: p.size,
        tableSearch: p.tableSearch,
        customerSearch: p.customerSearch,
        itemSearch: p.itemSearch,
      }),
    params: {
      page: params.page,
      size: params.size,
      tableSearch: params.tableSearch,
      customerSearch: params.customerSearch,
      itemSearch: params.itemSearch,
    },
    enabled: !!companyId,
  })
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => ordersApi.getOrderById(id!),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => ordersApi.createOrder(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOrderDto }) =>
      ordersApi.updateOrder(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useTransferOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: OrderTransferDto) => ordersApi.transferOrder(dto),
    onSuccess: (_data, dto) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(dto.orderId) })
    },
  })
}

export function useCloseOrdersBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderIds, tableId }: { orderIds: string[]; tableId?: string }) =>
      ordersApi.closeOrdersBatch(orderIds, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

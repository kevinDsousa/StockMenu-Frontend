import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as paymentMethodsApi from '@/api/payment-methods'
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/types/dto'

export const paymentMethodKeys = {
  list: (companyId: string | null) => ['payment-methods', companyId] as const,
  detail: (id: string) => ['payment-methods', id] as const,
}

export function usePaymentMethodsList(companyId: string | null) {
  return useQuery({
    queryKey: paymentMethodKeys.list(companyId),
    queryFn: () => paymentMethodsApi.getPaymentMethods(companyId ?? undefined),
    enabled: !!companyId,
  })
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreatePaymentMethodDto) => paymentMethodsApi.createPaymentMethod(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list(variables.companyId) })
    },
  })
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePaymentMethodDto }) =>
      paymentMethodsApi.updatePaymentMethod(id, dto),
    onSuccess: (_, { id, dto }) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list(dto.companyId) })
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.detail(id) })
    },
  })
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as paymentHistoryApi from '@/api/payment-history'

const keys = {
  all: ['payment-history'] as const,
  list: (companyId: string) => [...keys.all, 'list', companyId] as const,
}

export function usePaymentHistory(companyId: string | undefined) {
  return useQuery({
    queryKey: keys.list(companyId ?? ''),
    queryFn: () => paymentHistoryApi.getPaymentHistory(companyId!),
    enabled: !!companyId,
  })
}

export function useRegisterPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tableId, paymentMethodId }: { tableId: string; paymentMethodId: string | null }) =>
      paymentHistoryApi.registerPayment(tableId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['venue-tables'] })
    },
  })
}

import type { PaymentHistory } from '@/entities'
import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'

export async function getPaymentHistory(companyId: string): Promise<PaymentHistory[]> {
  const { data } = await apiClient.get<ApiResponse<PaymentHistory[]>>('/paymentHistory', {
    params: { companyId },
  })
  const list = unwrapApiData(data ?? [])
  return Array.isArray(list) ? list : []
}

export async function registerPayment(tableId: string, paymentMethodId: string | null): Promise<PaymentHistory> {
  const { data } = await apiClient.post<ApiResponse<PaymentHistory>>('/paymentHistory', {
    tableId,
    paymentMethodId,
  })
  return unwrapApiData(data!)
}

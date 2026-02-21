import type { PaymentMethod } from '@/entities'
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/types/dto'
import { apiClient } from './client'

export async function getPaymentMethods(companyId?: string): Promise<PaymentMethod[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<PaymentMethod[]>('/payment-methods', { params })
  return data
}

export async function getPaymentMethodById(id: string): Promise<PaymentMethod> {
  const { data } = await apiClient.get<PaymentMethod>(`/payment-methods/${id}`)
  return data
}

export async function createPaymentMethod(dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
  const { data } = await apiClient.post<PaymentMethod>('/payment-methods', dto)
  return data
}

export async function updatePaymentMethod(id: string, dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
  const { data } = await apiClient.patch<PaymentMethod>(`/payment-methods/${id}`, dto)
  return data
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await apiClient.delete(`/payment-methods/${id}`)
}

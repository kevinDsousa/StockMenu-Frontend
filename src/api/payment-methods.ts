import type { ApiResponse } from '@/types/api'
import { unwrapApiData } from '@/types/api'
import { apiClient } from './client'
import type { PaymentMethod } from '@/entities'
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/types/dto'

export async function getPaymentMethods(companyId?: string): Promise<PaymentMethod[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<ApiResponse<PaymentMethod[]> | PaymentMethod[]>('/paymentMethod', { params })
  const list = unwrapApiData(data ?? [])
  return Array.isArray(list) ? list : []
}

export async function getPaymentMethodById(id: string): Promise<PaymentMethod> {
  const { data } = await apiClient.get<ApiResponse<PaymentMethod> | PaymentMethod>(`/paymentMethod/${id}`)
  return unwrapApiData(data!)
}

export async function createPaymentMethod(dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
  const { data } = await apiClient.post<ApiResponse<PaymentMethod> | PaymentMethod>('/paymentMethod', {
    companyId: dto.companyId,
    name: dto.name.trim(),
    active: dto.active ?? true,
    allowsDelivery: dto.allowsDelivery ?? true,
    onlinePayment: dto.onlinePayment ?? false,
  })
  return unwrapApiData(data!)
}

export async function updatePaymentMethod(id: string, dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
  const { data } = await apiClient.put<ApiResponse<PaymentMethod> | PaymentMethod>(`/paymentMethod/${id}`, {
    companyId: dto.companyId,
    name: dto.name?.trim(),
    active: dto.active,
    allowsDelivery: dto.allowsDelivery,
    onlinePayment: dto.onlinePayment,
  })
  return unwrapApiData(data!)
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await apiClient.delete(`/paymentMethod/${id}`)
}

import type { Subscription } from '@/entities'
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '@/types/dto'
import { apiClient } from './client'

export async function getSubscriptions(companyId?: string): Promise<Subscription[]> {
  const params = companyId ? { companyId } : {}
  const { data } = await apiClient.get<Subscription[]>('/subscriptions', { params })
  return data
}

export async function getSubscriptionById(id: string): Promise<Subscription> {
  const { data } = await apiClient.get<Subscription>(`/subscriptions/${id}`)
  return data
}

export async function createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>('/subscriptions', dto)
  return data
}

export async function updateSubscription(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
  const { data } = await apiClient.patch<Subscription>(`/subscriptions/${id}`, dto)
  return data
}

export async function deleteSubscription(id: string): Promise<void> {
  await apiClient.delete(`/subscriptions/${id}`)
}

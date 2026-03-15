import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PagedResponse, PaginationParams } from '@/types/pagination'

export interface UsePaginatedQueryOptions<T, F extends Record<string, unknown> = Record<string, never>> {
  queryKey: unknown[]
  queryFn: (params: PaginationParams & F) => Promise<PagedResponse<T>>
  params: PaginationParams & F
  enabled?: boolean
}

export interface UsePaginatedQueryResult<T, F extends Record<string, unknown> = Record<string, never>>
  extends UseQueryResult<PagedResponse<T>> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export function usePaginatedQuery<T, F extends Record<string, unknown> = Record<string, never>>(
  options: UsePaginatedQueryOptions<T, F>
): UsePaginatedQueryResult<T, F> {
  const { queryKey, queryFn, params, enabled = true } = options
  const query = useQuery({
    queryKey,
    queryFn: () => queryFn(params),
    enabled,
  })
  const data = query.data
  return {
    ...query,
    content: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.number ?? params.page,
    size: data?.size ?? params.size,
  }
}

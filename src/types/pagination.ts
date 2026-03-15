export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface PaginationParams {
  page: number
  size: number
}

export interface UsePaginatedQueryOptions<T, F extends Record<string, unknown> = Record<string, never>> {
  queryKey: unknown[]
  queryFn: (params: PaginationParams & F) => Promise<PagedResponse<T>>
  params: PaginationParams & F
  enabled?: boolean
}

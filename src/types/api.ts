export interface ApiResponse<T> {
  data?: T
  message?: string
  errors?: string[]
  status?: number
}

export function unwrapApiData<T>(response: ApiResponse<T> | T): T {
  if (response != null && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data as T
  }
  return response as T
}

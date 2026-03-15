interface AxiosErrorResponse {
  message?: string
  errors?: string[]
}

function isAxiosError(error: unknown): error is { response?: { data?: AxiosErrorResponse }; message?: string } {
  return typeof error === 'object' && error !== null
}

export function extractApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro. Tente novamente.'): string {
  if (!isAxiosError(error)) return fallback
  const data = error.response?.data
  const message = typeof data?.message === 'string' ? data.message : null
  const firstError = Array.isArray(data?.errors) && data.errors.length > 0 ? String(data.errors[0]) : null
  return message || firstError || (typeof error.message === 'string' ? error.message : fallback)
}


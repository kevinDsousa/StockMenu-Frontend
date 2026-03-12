export function extractApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro. Tente novamente.') {
  const err = error as any
  return (
    err?.response?.data?.message ||
    err?.response?.data?.errors?.[0] ||
    err?.message ||
    fallback
  )
}


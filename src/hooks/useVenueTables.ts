import { useQuery } from '@tanstack/react-query'
import { getVenueTables } from '@/api/venue-tables'

const keys = {
  all: ['venue-tables'] as const,
  list: (companyId?: string) => [...keys.all, 'list', companyId] as const,
}

export function useVenueTables(companyId?: string) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => getVenueTables(companyId),
  })
}


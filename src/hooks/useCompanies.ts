import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as companiesApi from '@/api/companies'
import type { CreateCompanyDto, UpdateCompanyDto } from '@/types/dto'

const keys = {
  all: ['companies'] as const,
  list: () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useCompanies() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: companiesApi.getCompanies,
  })
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => companiesApi.getCompanyById(id!),
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCompanyDto) => companiesApi.createCompany(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCompanyDto }) =>
      companiesApi.updateCompany(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

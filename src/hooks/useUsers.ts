import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as usersApi from '@/api/users'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto'

const keys = {
  all: ['users'] as const,
  list: (companyId: string | null) => [...keys.all, 'list', companyId] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}

export function useUsers(companyId: string | null) {
  return useQuery({
    queryKey: keys.list(companyId),
    queryFn: () => usersApi.getUsersByCompany(companyId!),
    enabled: !!companyId,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersApi.createUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      usersApi.updateUser(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}


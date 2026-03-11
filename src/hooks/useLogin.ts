import { useMutation } from '@tanstack/react-query'
import type { LoginRequestDto, LoginResponseDto } from '@/api'
import { login } from '@/api'
import { useAuthStore } from '@/store/auth'

export function useLogin() {
  const loginStore = useAuthStore((state) => state.login)

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload: LoginRequestDto) => {
      const response = await login(payload)
      return response
    },
    onSuccess: (response) => {
      const user: LoginResponseDto = response.data

      loginStore(user.token, {
        userId: user.userId,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
      })
    },
  })
}


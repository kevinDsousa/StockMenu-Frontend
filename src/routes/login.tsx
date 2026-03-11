import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Box, Paper, Stack, Title, Text } from '@mantine/core'
import { useState } from 'react'
import { z } from 'zod'
import { AppInput, AppPasswordInput, Button } from '@/components/ui'
import { useLogin } from '@/hooks'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
})

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFormError('Verifique os dados informados.')
      return
    }

    try {
      await mutateAsync(parsed.data)
      router.navigate({ to: '/' })
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Falha ao efetuar login.'
      setFormError(message)
    }
  }

  return (
    <Box
      component="main"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper w={360} withBorder shadow="md" p="lg" radius="md">
        <Stack gap="md">
          <Title order={3}>Entrar no StockMenu</Title>
          {formError && (
            <Text size="sm" c="red">
              {formError}
            </Text>
          )}
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <AppInput
                label="E-mail"
                placeholder="email@empresa.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                status={formError ? 'error' : 'default'}
              />
              <AppPasswordInput
                label="Senha"
                placeholder="Sua senha"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                status={formError ? 'error' : 'default'}
              />
              <Button type="submit" loading={isPending} fullWidth>
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  )
}


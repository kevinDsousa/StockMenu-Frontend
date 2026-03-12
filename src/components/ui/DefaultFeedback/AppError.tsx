import { Alert } from '@mantine/core'

interface AppErrorProps {
  message?: string
}

export function AppError({ message = 'Ocorreu um erro ao carregar os dados.' }: AppErrorProps) {
  return (
    <Alert color="red" variant="light">
      {message}
    </Alert>
  )
}


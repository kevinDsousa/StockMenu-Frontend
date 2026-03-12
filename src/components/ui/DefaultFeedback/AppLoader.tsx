import { Group, Loader } from '@mantine/core'

interface AppLoaderProps {
  centered?: boolean
}

export function AppLoader({ centered = true }: AppLoaderProps) {
  if (centered) {
    return (
      <Group justify="center" my="lg">
        <Loader />
      </Group>
    )
  }

  return <Loader />
}


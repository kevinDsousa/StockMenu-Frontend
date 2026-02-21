import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { theme } from '@/theme/theme'
import { QueryProvider } from '@/providers/QueryProvider'
import { AppRouter } from '@/router'

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </MantineProvider>
  )
}

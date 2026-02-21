import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';

export const App = () => {
  return (
    <MantineProvider theme={theme}>
      <RoutesPages />
    </MantineProvider>
  )
}

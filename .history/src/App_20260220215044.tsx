import './App.css'
import { MantineProvider, createTheme } from '@mantine/core';

export const App = () => {
  return (
    <MantineProvider theme={theme}>
      <RoutesPages />
    </MantineProvider>
  )
}

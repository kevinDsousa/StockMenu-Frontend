import { createTheme } from '@mantine/core'
import { themeColors } from './colors'

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  other: themeColors,
})

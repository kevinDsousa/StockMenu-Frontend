import { createTheme, rem } from '@mantine/core'
import { themeColors } from './colors'

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  defaultRadius: 'md',
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },
  fontFamily: 'system-ui, -apple-system, sans-serif',
  other: themeColors,
})

import { Box, Title, type BoxProps } from '@mantine/core'
import { type ReactNode } from 'react'

export interface PageContainerProps extends BoxProps {
  title: string
  children: ReactNode
}

export function PageContainer({ title, children, ...boxProps }: PageContainerProps) {
  return (
    <Box {...boxProps}>
      <Title order={2} mb="lg">
        {title}
      </Title>
      {children}
    </Box>
  )
}

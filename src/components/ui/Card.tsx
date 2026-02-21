import { Card as MantineCard, type CardProps } from '@mantine/core'

export function Card(props: CardProps) {
  return <MantineCard withBorder shadow="sm" radius="md" {...props} />
}

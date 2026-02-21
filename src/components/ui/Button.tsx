import { Button as MantineButton, type ButtonProps } from '@mantine/core'

export function Button(props: ButtonProps) {
  return <MantineButton radius="md" {...props} />
}

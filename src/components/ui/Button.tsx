import { Button as MantineButton, type ButtonProps } from '@mantine/core'
import { type ComponentPropsWithoutRef } from 'react'

export function Button(
  props: ButtonProps & ComponentPropsWithoutRef<'button'>,
) {
  return <MantineButton radius="md" {...props} />
}

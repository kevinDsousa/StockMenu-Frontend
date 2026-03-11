import { Button as MantineButton, type ButtonProps } from '@mantine/core'
import type { ComponentPropsWithoutRef } from 'react'
import {
  buildButtonStyles,
  isAutoDisabled,
  type AppButtonProps,
} from './__button.config'

type Props = AppButtonProps & ButtonProps & ComponentPropsWithoutRef<'button'>

export const AppButton = ({
  status = 'default',
  styleConfig,
  disabled,
  ...props
}: Props) => {
  return (
    <MantineButton
      radius="md"
      disabled={disabled ?? isAutoDisabled(status)}
      styles={buildButtonStyles(status, styleConfig)}
      {...props}
    />
  )
}

export const Button = AppButton
import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import type { ComponentPropsWithoutRef } from 'react';
import {
  buildPasswordInputStyles,
  type AppPasswordInputProps,
} from './__password-input.config';

type Props = AppPasswordInputProps &
  PasswordInputProps &
  ComponentPropsWithoutRef<'input'>;

export const AppPasswordInput = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <PasswordInput
      radius="md"
      styles={buildPasswordInputStyles(status, styleConfig)}
      {...props}
    />
  );
};


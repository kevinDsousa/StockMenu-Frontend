import { TextInput, type TextInputProps } from '@mantine/core';
import type { ComponentPropsWithoutRef } from 'react';
import { buildInputStyles, type AppInputProps } from './__input.config';

type Props = AppInputProps & TextInputProps & ComponentPropsWithoutRef<'input'>;

export const AppInput = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <TextInput
      radius="md"
      styles={buildInputStyles(status, styleConfig)}
      {...props}
    />
  );
};


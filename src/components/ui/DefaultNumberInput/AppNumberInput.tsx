import { NumberInput as MantineNumberInput, type NumberInputProps } from '@mantine/core';
import {
  buildNumberInputStyles,
  type AppNumberInputProps,
} from './__number-input.config';

type Props = AppNumberInputProps & NumberInputProps;

export const AppNumberInput = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <MantineNumberInput
      radius="md"
      styles={buildNumberInputStyles(status, styleConfig)}
      {...props}
    />
  );
};

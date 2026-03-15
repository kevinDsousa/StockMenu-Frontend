import { Select as MantineSelect, type SelectProps } from '@mantine/core';
import { buildSelectStyles, type AppSelectProps } from './__select.config';

type Props = AppSelectProps & SelectProps;

export const AppSelect = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <MantineSelect
      radius="md"
      styles={buildSelectStyles(status, styleConfig)}
      {...props}
    />
  );
};

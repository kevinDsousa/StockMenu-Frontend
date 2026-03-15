import { Checkbox as MantineCheckbox, type CheckboxProps } from '@mantine/core';
import { buildCheckboxStyles, type AppCheckboxProps } from './__checkbox.config';

type Props = AppCheckboxProps & CheckboxProps;

export const AppCheckbox = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <MantineCheckbox
      radius="sm"
      styles={buildCheckboxStyles(status, styleConfig)}
      {...props}
    />
  );
};

import { Switch as MantineSwitch, type SwitchProps } from '@mantine/core';
import { buildSwitchStyles, type AppSwitchProps } from './__switch.config';

type Props = AppSwitchProps & SwitchProps;

export const AppSwitch = ({
  status = 'default',
  styleConfig,
  ...props
}: Props) => {
  return (
    <MantineSwitch
      size="md"
      styles={buildSwitchStyles(status, styleConfig)}
      {...props}
    />
  );
};

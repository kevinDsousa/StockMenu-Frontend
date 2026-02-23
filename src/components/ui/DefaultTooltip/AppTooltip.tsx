import { Tooltip } from '@mantine/core';
import type { AppTooltipProps } from './__tooltip.config';

export const AppTooltip = ({ label, children, position = 'top', withArrow = true }: AppTooltipProps) => {
  return (
    <Tooltip label={label} position={position} withArrow={withArrow}>
      {children}
    </Tooltip>
  );
};
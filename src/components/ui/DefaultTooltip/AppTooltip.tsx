import type { ReactNode } from 'react';
import { Tooltip } from '@mantine/core';

export interface AppTooltipProps {
  label: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  withArrow?: boolean;
}

export const AppTooltip = ({
  label,
  children,
  position = 'top',
  withArrow = true,
}: AppTooltipProps) => {
  return (
    <Tooltip label={label} position={position} withArrow={withArrow}>
      {children}
    </Tooltip>
  );
};
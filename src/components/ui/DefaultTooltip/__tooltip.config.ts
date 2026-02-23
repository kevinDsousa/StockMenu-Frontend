import type { ReactNode } from "react";

export interface AppTooltipProps {
  label: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  withArrow?: boolean;
}

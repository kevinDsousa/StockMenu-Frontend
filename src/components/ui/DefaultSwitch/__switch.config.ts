import type { ReactNode } from 'react';

export type SwitchStatus = 'default' | 'error';

export interface SwitchStyleConfig {
  trackColor?: string;
  thumbColor?: string;
  labelColor?: string;
}

export interface AppSwitchProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  status?: SwitchStatus;
  styleConfig?: SwitchStyleConfig;
}

const STATUS_STYLE_MAP: Record<SwitchStatus, SwitchStyleConfig> = {
  default: {
    trackColor: 'var(--mantine-color-default-border)',
    thumbColor: 'var(--mantine-color-white)',
    labelColor: 'var(--mantine-color-text)',
  },
  error: {
    trackColor: 'var(--mantine-color-red-6)',
    thumbColor: 'var(--mantine-color-white)',
    labelColor: 'var(--mantine-color-red-9)',
  },
};

export const buildSwitchStyles = (
  status: SwitchStatus = 'default',
  config: SwitchStyleConfig = {}
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };
  return {
    track: {
      backgroundColor: c.trackColor,
    },
    thumb: {
      backgroundColor: c.thumbColor,
    },
    label: {
      color: c.labelColor,
    },
  };
};

import type { ReactNode } from 'react';

export type CheckboxStatus = 'default' | 'error';

export interface CheckboxStyleConfig {
  borderColor?: string;
  backgroundColor?: string;
  labelColor?: string;
}

export interface AppCheckboxProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  status?: CheckboxStatus;
  styleConfig?: CheckboxStyleConfig;
}

const STATUS_STYLE_MAP: Record<CheckboxStatus, CheckboxStyleConfig> = {
  default: {
    borderColor: 'var(--mantine-color-default-border)',
    backgroundColor: 'var(--mantine-color-body)',
    labelColor: 'var(--mantine-color-text)',
  },
  error: {
    borderColor: 'var(--mantine-color-red-6)',
    backgroundColor: 'var(--mantine-color-red-0)',
    labelColor: 'var(--mantine-color-red-9)',
  },
};

export const buildCheckboxStyles = (
  status: CheckboxStatus = 'default',
  config: CheckboxStyleConfig = {}
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };
  return {
    input: {
      borderColor: c.borderColor,
      backgroundColor: c.backgroundColor,
    },
    label: {
      color: c.labelColor,
    },
  };
};

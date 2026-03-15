import type { ReactNode } from 'react';

export type SelectStatus = 'default' | 'error' | 'success';

export interface SelectStyleConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;
}

export interface AppSelectProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  status?: SelectStatus;
  styleConfig?: SelectStyleConfig;
}

const STATUS_STYLE_MAP: Record<SelectStatus, SelectStyleConfig> = {
  default: {
    backgroundColor: 'var(--mantine-color-body)',
    borderColor: 'var(--mantine-color-default-border)',
    textColor: 'var(--mantine-color-text)',
    placeholderColor: 'var(--mantine-color-dimmed)',
  },
  error: {
    backgroundColor: 'var(--mantine-color-red-0)',
    borderColor: 'var(--mantine-color-red-6)',
    textColor: 'var(--mantine-color-red-9)',
    placeholderColor: 'var(--mantine-color-red-5)',
  },
  success: {
    backgroundColor: 'var(--mantine-color-green-0)',
    borderColor: 'var(--mantine-color-green-5)',
    textColor: 'var(--mantine-color-green-9)',
    placeholderColor: 'var(--mantine-color-green-6)',
  },
};

export const buildSelectStyles = (
  status: SelectStatus = 'default',
  config: SelectStyleConfig = {}
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };
  return {
    input: {
      backgroundColor: c.backgroundColor,
      borderColor: c.borderColor,
      color: c.textColor,
    },
  };
};

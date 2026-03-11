import type { ReactNode } from 'react';

export type InputStatus = 'default' | 'error' | 'success';

export interface InputStyleConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;
}

export interface AppInputProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  status?: InputStatus;
  styleConfig?: InputStyleConfig;
}

const STATUS_STYLE_MAP: Record<InputStatus, InputStyleConfig> = {
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

export const buildInputStyles = (
  status: InputStatus = 'default',
  config: InputStyleConfig = {},
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };

  return {
    input: {
      backgroundColor: c.backgroundColor,
      borderColor: c.borderColor,
      color: c.textColor,
      '::placeholder': {
        color: c.placeholderColor,
      },
    },
  };
};


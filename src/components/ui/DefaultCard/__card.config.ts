import type { ReactNode } from 'react';

// =============================================================================
// TIPAGENS
// =============================================================================

export type CardStatus = 'default' | 'success' | 'danger' | 'warning' | 'info';

export interface CardStyleConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  shadowColor?: string;
}

export interface AppCardProps {
  status?: CardStatus;
  styleConfig?: CardStyleConfig;
  children?: ReactNode;
}

// =============================================================================
// MAPEAMENTO DE STATUS → VISUAL
// =============================================================================

const STATUS_STYLE_MAP: Record<CardStatus, CardStyleConfig> = {
  default: {
    backgroundColor: 'var(--mantine-color-body)',
    borderColor: 'var(--mantine-color-default-border)',
    textColor: 'var(--mantine-color-text)',
  },
  success: {
    backgroundColor: 'var(--mantine-color-green-0)',
    borderColor: 'var(--mantine-color-green-4)',
    textColor: 'var(--mantine-color-green-9)',
  },
  danger: {
    backgroundColor: 'var(--mantine-color-red-0)',
    borderColor: 'var(--mantine-color-red-4)',
    textColor: 'var(--mantine-color-red-9)',
  },
  warning: {
    backgroundColor: 'var(--mantine-color-yellow-0)',
    borderColor: 'var(--mantine-color-yellow-4)',
    textColor: 'var(--mantine-color-yellow-9)',
  },
  info: {
    backgroundColor: 'var(--mantine-color-blue-0)',
    borderColor: 'var(--mantine-color-blue-4)',
    textColor: 'var(--mantine-color-blue-9)',
  },
};

// =============================================================================
// BUILD DE ESTILOS
// =============================================================================

export const buildCardStyles = (
  status: CardStatus = 'default',
  config: CardStyleConfig = {}
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };

  return {
    root: {
      backgroundColor: c.backgroundColor,
      borderColor: c.borderColor,
      color: c.textColor,
    },
  };
};
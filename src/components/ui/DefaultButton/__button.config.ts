// =============================================================================
// TIPAGENS
// =============================================================================

export type ButtonStatus = 'default' | 'success' | 'danger' | 'warning' | 'info';

export interface ButtonStyleConfig {
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  disabledBackgroundColor?: string;
  disabledTextColor?: string;
}

export interface AppButtonProps {
  status?: ButtonStatus;
  /** Override pontual de qualquer token visual */
  styleConfig?: ButtonStyleConfig;
}

// =============================================================================
// MAPEAMENTO DE STATUS → VISUAL
// Centralizado aqui — alterar uma cor reflete em todos os botões do sistema.
// =============================================================================

const STATUS_STYLE_MAP: Record<ButtonStatus, ButtonStyleConfig> = {
  default: {
    backgroundColor: 'var(--mantine-primary-color-filled)',
    textColor: '#fff',
    hoverColor: 'var(--mantine-primary-color-filled-hover)',
    disabledBackgroundColor: 'var(--mantine-color-gray-3)',
    disabledTextColor: 'var(--mantine-color-gray-6)',
  },
  success: {
    backgroundColor: 'var(--mantine-color-green-6)',
    textColor: '#fff',
    hoverColor: 'var(--mantine-color-green-7)',
    disabledBackgroundColor: 'var(--mantine-color-green-2)',
    disabledTextColor: 'var(--mantine-color-green-5)',
  },
  danger: {
    backgroundColor: 'var(--mantine-color-red-6)',
    textColor: '#fff',
    hoverColor: 'var(--mantine-color-red-7)',
    disabledBackgroundColor: 'var(--mantine-color-red-2)',
    disabledTextColor: 'var(--mantine-color-red-4)',
  },
  warning: {
    backgroundColor: 'var(--mantine-color-yellow-5)',
    textColor: '#000',
    hoverColor: 'var(--mantine-color-yellow-6)',
    disabledBackgroundColor: 'var(--mantine-color-yellow-2)',
    disabledTextColor: 'var(--mantine-color-yellow-5)',
  },
  info: {
    backgroundColor: 'var(--mantine-color-blue-5)',
    textColor: '#fff',
    hoverColor: 'var(--mantine-color-blue-6)',
    disabledBackgroundColor: 'var(--mantine-color-blue-2)',
    disabledTextColor: 'var(--mantine-color-blue-4)',
  },
};

// =============================================================================
// STATUS QUE FORÇAM DISABLED AUTOMATICAMENTE
// Adicione aqui qualquer status que deva bloquear interação.
// =============================================================================

const AUTO_DISABLED_STATUSES = new Set<ButtonStatus>([
]);

export const isAutoDisabled = (status: ButtonStatus): boolean =>
  AUTO_DISABLED_STATUSES.has(status);

// =============================================================================
// BUILD DE ESTILOS
// =============================================================================

export const buildButtonStyles = (
  status: ButtonStatus = 'default',
  config: ButtonStyleConfig = {}
) => {
  const base = STATUS_STYLE_MAP[status];
  const c = { ...base, ...config };

  return {
    root: {
      backgroundColor: c.backgroundColor,
      color: c.textColor,
      border: 'none',
      transition: 'background 150ms ease',

      '&:hover:not(:disabled)': {
        backgroundColor: c.hoverColor,
      },

      '&:disabled, &[data-disabled]': {
        backgroundColor: c.disabledBackgroundColor,
        color: c.disabledTextColor,
        cursor: 'not-allowed',
        opacity: 1,
      },
    },
  };
};
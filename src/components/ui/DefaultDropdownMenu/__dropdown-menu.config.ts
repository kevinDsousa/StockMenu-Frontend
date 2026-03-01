import type { ReactNode } from 'react';

// =============================================================================
// TIPAGENS
// =============================================================================

export type DropdownItemVariant = 'default' | 'danger';

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: DropdownItemVariant;
}

export interface DropdownMenuDivider {
  divider: true;
}

export type DropdownMenuEntry = DropdownMenuItem | DropdownMenuDivider;

export const isDivider = (entry: DropdownMenuEntry): entry is DropdownMenuDivider =>
  'divider' in entry && entry.divider === true;

export interface DropdownMenuStyleConfig {
  textColor?: string;
  dangerColor?: string;
  backgroundColor?: string;
  hoverColor?: string;
  fontSize?: string | number;
  borderRadius?: string | number;
}

/** Props do componente pai — não expõe items, quem define é o filho */
export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuEntry[];
  styleConfig?: DropdownMenuStyleConfig;
  position?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
}

/**
 * Tipo base para criar dropdowns filhos do AppDropdownMenu.
 * O filho define os items e passa o trigger — não redefine o visual.
 */
export type DropdownMenuVariantProps = Omit<DropdownMenuProps, 'items'> & {
  items?: DropdownMenuEntry[];
};

// =============================================================================
// ESTILOS DO SISTEMA
// Centralizado aqui — filhos herdam sem precisar redefinir nada visual.
// =============================================================================

const SYSTEM_STYLE_CONFIG: Required<DropdownMenuStyleConfig> = {
  textColor: 'var(--mantine-color-text)',
  dangerColor: 'var(--mantine-color-red-6)',
  backgroundColor: 'var(--mantine-color-body)',
  hoverColor: 'var(--mantine-color-default-hover)',
  fontSize: 14,
  borderRadius: 8,
};

export const buildDropdownStyles = (config: DropdownMenuStyleConfig = {}) => {
  const c = { ...SYSTEM_STYLE_CONFIG, ...config };

  return {
    dropdown: {
      backgroundColor: c.backgroundColor,
      borderRadius: c.borderRadius,
      padding: '4px',
      minWidth: 'max-content',
    },
    item: {
      fontSize: c.fontSize,
      color: c.textColor,
      borderRadius: 6,
      padding: '8px 12px',
    },
    dangerItem: {
      color: c.dangerColor,
    },
  };
};
import type { ReactNode } from 'react';

export interface NavMenuItemProps {
  item: NavMenuItem;
  activeLabel?: string;
  depth?: number;
  styles: ReturnType<typeof buildNavMenuStyles>;
}

export interface NavMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  children?: NavMenuItem[];
}

export interface NavMenuStyleConfig {
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  fontSize?: string | number;
  itemSpacing?: string | number;
}

export interface NavMenuProps {
  items: NavMenuItem[];
  activeLabel?: string;
  styleConfig?: NavMenuStyleConfig;
}

export const DEFAULT_STYLE_CONFIG: NavMenuStyleConfig = {
  backgroundColor: 'transparent',
  textColor: 'var(--mantine-color-text)',
  activeColor: 'var(--mantine-primary-color-filled)',
  fontSize: 14,
  itemSpacing: 4,
};

export const buildNavMenuStyles = (config: NavMenuStyleConfig = {}) => {
  const merged = { ...DEFAULT_STYLE_CONFIG, ...config };

  return {
    merged,
    itemStyle: {
      fontSize: merged.fontSize,
      color: merged.textColor,
      padding: `${merged.itemSpacing}px 12px`,
      borderRadius: 6,
      cursor: 'pointer',
      transition: 'background 150ms ease',
    },
    activeItemStyle: {
      backgroundColor: merged.activeColor,
      color: '#fff',
    },
    wrapperStyle: {
      backgroundColor: merged.backgroundColor,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: merged.itemSpacing,
      padding: '8px 0',
    },
  };
};
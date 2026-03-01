import type { ReactNode } from 'react';

export type SideBarPosition = 'left' | 'right';

export interface SideBarProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: SideBarPosition;
  width?: string | number;
  title?: ReactNode;
  backgroundColor?: string;
  withoutOverlay?: boolean;
  zIndex?: number;
}

export type SideBarVariantProps = Omit<SideBarProps, 'children'> & {
  children?: ReactNode;
};

// =============================================================================
// ESTILOS INTERNOS DO DRAWER (Mantine v8)
// =============================================================================

export const buildDrawerStyles = (
  position: SideBarPosition = 'left',
  backgroundColor?: string
) => ({
  inner: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'stretch',
    justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
  },
  content: {
    backgroundColor,
    height: '100%',
    borderRadius: 0,
  },
});
import type { ReactNode } from 'react';

export interface SideBarProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  width?: string | number;
  title?: ReactNode;
  backgroundColor?: string;
}
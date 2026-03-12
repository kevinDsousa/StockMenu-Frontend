import type { ReactNode } from 'react';

export interface BaseModalProps {
  children: ReactNode;
  isOpen?: boolean;
  opened?: boolean;
  onClose: () => void;
  title?: string;
  size?: string | number;
  centered?: boolean;
  confirmLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
}
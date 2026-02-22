import { Modal } from '@mantine/core';
import type { BaseModalProps } from './__modal.config';

export const AppModal = ({ children, isOpen, onClose, title, size = 'md', centered = true }: BaseModalProps) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
    >
      {children}
    </Modal>
  );
};
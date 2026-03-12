import { Button, Group, Modal } from '@mantine/core';
import type { BaseModalProps } from './__modal.config';

export const AppModal = ({
  children,
  isOpen,
  opened,
  onClose,
  title,
  size = 'md',
  centered = true,
  confirmLabel,
  onConfirm,
  loading = false,
}: BaseModalProps) => {
  const isOpenState = opened ?? isOpen ?? false;

  return (
    <Modal
      opened={isOpenState}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
    >
      {children}
      {confirmLabel != null && onConfirm != null && (
        <Group justify="flex-end" mt="md" gap="xs">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      )}
    </Modal>
  );
};
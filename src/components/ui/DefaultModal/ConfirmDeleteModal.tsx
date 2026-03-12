import { Stack, Text } from '@mantine/core'
import type { BaseModalProps } from './__modal.config'
import { AppModal } from './AppModal'

type ConfirmDeleteModalProps = Omit<
  BaseModalProps,
  'children' | 'confirmLabel' | 'onConfirm'
> & {
  opened: boolean
  title?: string
  description?: string
  itemLabel?: string
  confirmLabel?: string
  onConfirm: () => void
}

export const ConfirmDeleteModal = ({
  opened,
  onClose,
  onConfirm,
  title = 'Confirmar exclusão',
  description = 'Esta ação não poderá ser desfeita.',
  itemLabel,
  confirmLabel = 'Excluir',
  size = 'sm',
  centered = true,
  loading,
}: ConfirmDeleteModalProps) => {
  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      loading={loading}
    >
      <Stack gap="xs">
        {itemLabel && (
          <Text>
            Tem certeza que deseja excluir{' '}
            <Text component="span" fw={600}>
              {itemLabel}
            </Text>
            ?
          </Text>
        )}
        <Text c="red" size="sm">
          {description}
        </Text>
      </Stack>
    </AppModal>
  )
}


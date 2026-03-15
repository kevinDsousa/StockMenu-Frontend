import { Group, Pagination as MantinePagination, Select, Text } from '@mantine/core'

export interface AppPaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange?: (size: number) => void
  sizeOptions?: number[]
}

const DEFAULT_SIZE_OPTIONS = [10, 20, 50]

export function AppPagination({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
  sizeOptions = DEFAULT_SIZE_OPTIONS,
}: AppPaginationProps) {
  if (totalPages <= 0 && totalElements <= 0) return null

  const start = totalElements === 0 ? 0 : page * size + 1
  const end = Math.min((page + 1) * size, totalElements)

  return (
    <Group justify="space-between" wrap="wrap" gap="sm">
      <Group gap="sm">
        <Text size="sm" c="dimmed">
          {totalElements === 0 ? 'Nenhum registro' : `Mostrando ${start}–${end} de ${totalElements}`}
        </Text>
        {onSizeChange && (
          <Select
            size="xs"
            w={80}
            data={sizeOptions.map(String)}
            value={String(size)}
            onChange={(v) => v && onSizeChange(Number(v))}
          />
        )}
      </Group>
      {totalPages > 1 && (
        <MantinePagination
          total={totalPages}
          value={page + 1}
          onChange={(v) => onPageChange(v - 1)}
          size="sm"
          withEdges
        />
      )}
    </Group>
  )
}

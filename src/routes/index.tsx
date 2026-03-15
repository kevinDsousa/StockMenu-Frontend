import { createFileRoute } from '@tanstack/react-router'
import { Card, Group, Stack, Text } from '@mantine/core'
import { Button, PageContainer, AppModal, AppInput, AppLoader, AppError } from '@/components'
import { VenueTables } from '@/components/widget/VenueTables/VenueTables'
import { SiderVenueTables } from '@/components/widget/SiderVenueTables/SiderVenueTables'
import { useState } from 'react'
import { useVenueTables, useCreateVenueTable, useUpdateVenueTable } from '@/hooks'
import { useAuthStore } from '@/store/auth'
import type { VenueTable } from '@/entities'
import { extractApiErrorMessage } from '@/utils/api-error'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'

export const Route = createFileRoute('/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTableId, setEditingTableId] = useState<string | null>(null)
  const [tableNumber, setTableNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = mustUseOwnCompany(user?.role) && !companyId
  const { data: tables, isLoading } = useVenueTables(needsCompany ? undefined : companyId)
  const createVenueTableMutation = useCreateVenueTable()
  const updateVenueTableMutation = useUpdateVenueTable()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ tableNumber?: string }>({})

  const tableList: VenueTable[] = tables ?? []

  if (needsCompany) {
    return (
      <PageContainer title="Dashboard">
        <Card>
          <Text c="dimmed" size="sm">
            {getNoCompanyMessage()}
          </Text>
        </Card>
      </PageContainer>
    )
  }

  const handleOpenSidebar = (tableId: string) => {
    setSelectedTableId(tableId)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setSelectedTableId(null)
  }

  const handleOpenNewTableModal = () => {
    setEditingTableId(null)
    setTableNumber('')
    setCapacity('')
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEditTableModal = (table: VenueTable) => {
    setEditingTableId(table.id)
    setTableNumber(String(table.tableNumber ?? ''))
    setCapacity(table.capacity != null ? String(table.capacity) : '')
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setErrorMessage(null)
    setFieldErrors({})
    setIsModalOpen(false)
  }

  const handleSubmitTable = () => {
    if (!companyId) return
    const parsedTableNumber = Number(tableNumber)
    const parsedCapacity = capacity ? Number(capacity) : null
    const errors: { tableNumber?: string } = {}
    if (!parsedTableNumber || parsedTableNumber < 1) errors.tableNumber = 'Informe um número válido (maior que zero)'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setErrorMessage(null)

    const onError = (err: unknown) => setErrorMessage(extractApiErrorMessage(err))
    const onSuccess = () => {
      setErrorMessage(null)
      setIsModalOpen(false)
    }

    if (editingTableId) {
      updateVenueTableMutation.mutate(
        {
          id: editingTableId,
          dto: {
            tableNumber: parsedTableNumber,
            capacity: parsedCapacity,
          },
        },
        { onError, onSuccess }
      )
    } else {
      createVenueTableMutation.mutate(
        {
          companyId: companyId!,
          tableNumber: parsedTableNumber,
          capacity: parsedCapacity,
        },
        { onError, onSuccess }
      )
    }
  }

  return (
    <PageContainer title="Dashboard">
      <Stack gap="sm" mb="md">
        {errorMessage && <AppError message={errorMessage} />}
        <Text c="dimmed">
          Visão geral de mesas da empresa.
        </Text>
        <Group justify="flex-start">
          <Button size="xs" onClick={handleOpenNewTableModal}>
            Nova mesa
          </Button>
        </Group>
      </Stack>

      {isLoading && <AppLoader />}

      {!isLoading && (!tableList || tableList.length === 0) && (
        <Text c="dimmed">Nenhuma mesa cadastrada para esta empresa.</Text>
      )}

      {!isLoading && tableList && tableList.length > 0 && (
        <Group gap="sm">
          {tableList.map((table) => (
            <VenueTables
              key={table.id}
              statusTable={table.status === 'FREE' ? 'open' : 'requesting_close'}
              tableNumber={table.tableNumber}
              onClick={() => handleOpenSidebar(table.id)}
              onContextMenu={(event) => {
                event.preventDefault()
                handleOpenEditTableModal(table)
              }}
            />
          ))}
        </Group>
      )}

      <SiderVenueTables
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        tableId={selectedTableId}
      />

      <AppModal
        opened={isModalOpen}
        title={editingTableId ? 'Editar mesa' : 'Nova mesa'}
        onClose={handleCloseModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmitTable}
        loading={createVenueTableMutation.isPending || updateVenueTableMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppInput
            label="Número da mesa"
            value={tableNumber}
            onChange={(event) => {
              setTableNumber(event.currentTarget.value)
              if (fieldErrors.tableNumber) setFieldErrors((prev) => ({ ...prev, tableNumber: undefined }))
            }}
            error={fieldErrors.tableNumber}
          />
          <AppInput
            label="Capacidade"
            value={capacity}
            onChange={(event) => setCapacity(event.currentTarget.value)}
            placeholder="Opcional"
          />
        </Stack>
      </AppModal>
    </PageContainer>
  )
}

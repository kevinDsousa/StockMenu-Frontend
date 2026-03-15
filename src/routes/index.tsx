import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge, Card, Group, Stack, Table, Tabs, Text } from '@mantine/core'
import { Button, PageContainer, AppModal, AppInput, AppLoader, AppError, Icon } from '@/components'
import { VenueTables } from '@/components/widget/VenueTables/VenueTables'
import { SiderVenueTables } from '@/components/widget/SiderVenueTables/SiderVenueTables'
import { useState } from 'react'
import {
  useVenueTables,
  useCreateVenueTable,
  useUpdateVenueTable,
  useOrders,
  usePrimaryProducts,
  useProducts,
} from '@/hooks'
import { useAuthStore } from '@/store/auth'
import type { VenueTable, Order, PrimaryProduct, Product } from '@/entities'
import { extractApiErrorMessage } from '@/utils/api-error'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'

export const Route = createFileRoute('/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const navigate = useNavigate()
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
  const { data: orders } = useOrders(needsCompany ? undefined : companyId)
  const { data: primaryProducts } = usePrimaryProducts(needsCompany ? undefined : companyId)
  const { data: products } = useProducts(needsCompany ? undefined : companyId)
  const createVenueTableMutation = useCreateVenueTable()
  const updateVenueTableMutation = useUpdateVenueTable()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ tableNumber?: string }>({})

  const tableList: VenueTable[] = tables ?? []
  const orderList: Order[] = orders ?? []
  const primaryList: PrimaryProduct[] = primaryProducts ?? []
  const productList: Product[] = products ?? []

  const tablesTotal = tableList.length
  const tablesOccupied = tableList.filter((t) => t.status !== 'FREE').length
  const openOrdersCount = orderList.filter((o) => !o.invoiced).length
  const lowStockPrimary = primaryList.filter((p) => p.isStockLow || p.isExpired || p.isExpiringSoon).length
  const lowStockProducts = productList.filter((p) => p.stockLow || p.isExpired).length
  const totalStockAlerts = lowStockPrimary + lowStockProducts

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
      <Stack gap="md" mb="md">
        {errorMessage && <AppError message={errorMessage} />}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Text c="dimmed" style={{ flex: 1, minWidth: 0 }}>
            Visão geral do salão, pedidos e alertas da empresa logada.
          </Text>
          <Button
            size="xs"
            status="default"
            leftSection={<Icon name="plus" size={14} />}
            onClick={handleOpenNewTableModal}
          >
            Nova mesa
          </Button>
        </Group>

        <Group gap="md">
          <Card withBorder radius="md" padding="md" style={{ flex: 1, minWidth: 0 }}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={500}>
                Mesas
              </Text>
              <Text size="lg" fw={700}>
                {tablesOccupied} / {tablesTotal}
              </Text>
              <Text size="xs" c="dimmed">
                ocupadas / totais
              </Text>
            </Stack>
          </Card>

          <Card withBorder radius="md" padding="md" style={{ flex: 1, minWidth: 0 }}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={500}>
                Pedidos em aberto
              </Text>
              <Text size="lg" fw={700}>
                {openOrdersCount}
              </Text>
              <Text size="xs" c="dimmed">
                ainda não faturados
              </Text>
            </Stack>
          </Card>

          <Card withBorder radius="md" padding="md" style={{ flex: 1, minWidth: 0 }}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={500}>
                Alertas de estoque
              </Text>
              <Text size="lg" fw={700}>
                {totalStockAlerts}
              </Text>
              <Text size="xs" c="dimmed">
                itens em baixa, vencendo ou vencidos
              </Text>
            </Stack>
          </Card>
        </Group>
      </Stack>

      <Group align="flex-start" justify="space-between" gap="md">
        <Stack gap="sm" style={{ flex: 3, minWidth: 0 }}>
          <Text fw={500} mb="xs">Salão</Text>

          {isLoading && <AppLoader />}

          {!isLoading && (!tableList || tableList.length === 0) && (
            <Text c="dimmed">Nenhuma mesa cadastrada para esta empresa.</Text>
          )}

          {!isLoading && tableList && tableList.length > 0 && (
            <Group gap="sm">
              {tableList.map((table) => {
                const statusTable =
                  table.status === 'FREE'
                    ? 'open'
                    : table.status === 'WAITING_FOR_BILL'
                      ? 'waiting_bill'
                      : table.status === 'CALLING_WAITER'
                        ? 'requesting_order'
                        : 'requesting_close'
                return (
                <VenueTables
                  key={table.id}
                  statusTable={statusTable}
                  tableNumber={table.tableNumber}
                  onClick={() => handleOpenSidebar(table.id)}
                  onContextMenu={(event) => {
                    event.preventDefault()
                    handleOpenEditTableModal(table)
                  }}
                />
              )})}
            </Group>
          )}
        </Stack>

        <Stack gap="sm" style={{ flex: 2, minWidth: 0 }}>
          <Tabs defaultValue="orders">
            <Tabs.List mb="xs">
              <Tabs.Tab value="orders">Pedidos em aberto</Tabs.Tab>
              <Tabs.Tab value="stock">Alertas de estoque</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="orders">
              {orderList.filter((o) => !o.invoiced).length === 0 ? (
                <Text c="dimmed" size="sm">
                  Nenhum pedido em aberto no momento.
                </Text>
              ) : (
                <Card withBorder radius="md">
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Mesa / Tipo</Table.Th>
                        <Table.Th>Cliente</Table.Th>
                        <Table.Th>Total</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {orderList
                        .filter((o) => !o.invoiced)
                        .map((order) => (
                          <Table.Tr
                            key={order.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
                            }
                          >
                            <Table.Td>
                              <Text size="sm" fw={500}>
                                {order.tableNumber != null
                                  ? `Mesa ${order.tableNumber}`
                                  : order.tableId
                                    ? order.tableId.slice(0, 8)
                                    : order.type}
                              </Text>
                            </Table.Td>
                            <Table.Td>{order.customerName ?? '—'}</Table.Td>
                            <Table.Td>
                              R${' '}
                              {order.totalAmount != null
                                ? order.totalAmount.toFixed(2)
                                : '0,00'}
                            </Table.Td>
                            <Table.Td>
                              <Badge color={order.invoiced ? 'green' : 'yellow'}>
                                {order.invoiced ? 'Faturado' : 'Em aberto'}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="stock">
              {totalStockAlerts === 0 ? (
                <Text c="dimmed" size="sm">
                  Nenhum alerta de estoque no momento.
                </Text>
              ) : (
                <Card withBorder radius="md">
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Tipo</Table.Th>
                        <Table.Th>Estoque</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {primaryList
                        .filter((p) => p.isStockLow || p.isExpired || p.isExpiringSoon)
                        .map((p) => (
                          <Table.Tr key={p.id}>
                            <Table.Td>{p.name}</Table.Td>
                            <Table.Td>Insumo</Table.Td>
                            <Table.Td>
                              {p.currentStock} {p.unit?.toLowerCase?.()}
                            </Table.Td>
                            <Table.Td>
                              <Group gap="xs">
                                {p.isStockLow && <Badge color="yellow">Em baixa</Badge>}
                                {p.isExpired && <Badge color="red">Vencido</Badge>}
                                {!p.isExpired && p.isExpiringSoon && (
                                  <Badge color="orange">Vencendo</Badge>
                                )}
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      {productList
                        .filter((p) => p.stockLow || p.isExpired)
                        .map((p) => (
                          <Table.Tr key={p.id}>
                            <Table.Td>{p.name}</Table.Td>
                            <Table.Td>Produto</Table.Td>
                            <Table.Td>{p.sellUnit}</Table.Td>
                            <Table.Td>
                              <Group gap="xs">
                                {p.stockLow && <Badge color="yellow">Em baixa</Badge>}
                                {p.isExpired && <Badge color="red">Vencido</Badge>}
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              )}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Group>

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

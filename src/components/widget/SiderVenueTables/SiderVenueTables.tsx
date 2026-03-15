import { AppSideBar } from "@/components/ui/DefaultSideBar/AppSideBar"
import { AppModal, Button, AppError, Icon } from "@/components"
import { Badge, Group, Stack, Text } from "@mantine/core"
import { AppNumberInput, AppSelect } from "@/components"
import { useOrders, useCreateOrder, useCloseOrdersBatch, useTransferOrder, useVenueTables, useSplitVenueTable, useMergeVenueTables, useUpdateVenueTableStatus, useRegisterPayment, usePaymentMethodsList } from "@/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/auth"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import type { Order, VenueTable } from "@/entities"
import { extractApiErrorMessage } from "@/utils/api-error"

interface SiderVenueTablesProps {
  isOpen: boolean
  onClose: () => void
  tableId: string | null
}

const orderDetailKey = (id: string) => ['orders', 'detail', id] as const

export const SiderVenueTables = ({ isOpen, onClose, tableId }: SiderVenueTablesProps) => {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const companyId = user?.companyId ?? undefined
  const { data } = useOrders(companyId)
  const { data: venueTables } = useVenueTables(companyId)
  const createOrderMutation = useCreateOrder()
  const closeOrdersBatchMutation = useCloseOrdersBatch()
  const transferOrderMutation = useTransferOrder()
  const splitVenueTableMutation = useSplitVenueTable()
  const mergeVenueTablesMutation = useMergeVenueTables()
  const updateVenueTableStatusMutation = useUpdateVenueTableStatus()
  const registerPaymentMutation = useRegisterPayment()
  const { data: paymentMethods = [] } = usePaymentMethodsList(companyId ?? null)
  const navigate = useNavigate()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [payPaymentMethodId, setPayPaymentMethodId] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [targetTableId, setTargetTableId] = useState<string | null>(null)
  const [splitTableNumber, setSplitTableNumber] = useState<number | ''>('')
  const [splitCapacity, setSplitCapacity] = useState<number | ''>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const allOrders: Order[] = data ?? []
  const tableOrders = allOrders.filter((order) => order.tableId === tableId)
  const openOrders = tableOrders.filter((o) => !o.invoiced)
  const totalOpen = openOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
  const totalTable = tableOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
  const tablesList: VenueTable[] = venueTables ?? []
  const currentTable = tableId ? tablesList.find((t) => t.id === tableId) : null
  const isWaitingForBill = currentTable?.status === 'WAITING_FOR_BILL'
  const allOrdersInvoiced = tableOrders.length > 0 && openOrders.length === 0
  const canShowPayButton =
    isWaitingForBill || (allOrdersInvoiced && currentTable != null && currentTable.status !== 'FREE')
  const otherTables = Array.from(
    new Map(
      allOrders
        .filter((order) => order.tableId && order.tableId !== tableId)
        .map((order) => [order.tableId, order])
    ).values()
  ) as Order[]

  useEffect(() => {
    if (!isOpen) setErrorMessage(null)
  }, [isOpen])

  const handleOpenTransferModal = (orderId: string) => {
    setSelectedOrderId(orderId)
    setTargetTableId(null)
    setIsTransferModalOpen(true)
  }

  const handleConfirmTransfer = () => {
    if (!selectedOrderId || !targetTableId) return
    setErrorMessage(null)
    transferOrderMutation.mutate(
      { orderId: selectedOrderId, targetTableId },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          setErrorMessage(null)
          setIsTransferModalOpen(false)
        },
      }
    )
  }

  const handleOpenSplitModal = () => {
    setSplitTableNumber('')
    setSplitCapacity('')
    setIsSplitModalOpen(true)
  }

  const handleConfirmSplit = () => {
    if (!tableId || !tableOrders.length) return
    if (!splitTableNumber || splitTableNumber <= 0) return
    setErrorMessage(null)
    splitVenueTableMutation.mutate(
      {
        id: tableId,
        dto: {
          targets: [
            {
              tableNumber: Number(splitTableNumber),
              capacity: splitCapacity ? Number(splitCapacity) : null,
              orderIds: tableOrders.map((o) => o.id),
            },
          ],
        },
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          setErrorMessage(null)
          setIsSplitModalOpen(false)
        },
      }
    )
  }

  const handleOpenMergeModal = () => {
    setTargetTableId(null)
    setIsMergeModalOpen(true)
  }

  const handleConfirmMerge = () => {
    if (!user?.companyId || !tableId || !targetTableId) return
    setErrorMessage(null)
    mergeVenueTablesMutation.mutate(
      {
        companyId: user.companyId,
        sourceTableIds: [tableId],
        targetTableId,
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          setErrorMessage(null)
          setIsMergeModalOpen(false)
        },
      }
    )
  }

  const handleOpenOrder = () => {
    if (!tableId || !user?.companyId) return

    setErrorMessage(null)
    createOrderMutation.mutate(
      {
        companyId: user.companyId,
        tableId,
        paymentMethodId: null,
        type: 'TABLE',
        customerName: null,
        deliveryAddress: null,
        totalAmount: 0,
        invoiced: false,
        items: [],
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: (orderOrResponse: Order | { data?: Order }) => {
          const order = orderOrResponse && typeof orderOrResponse === 'object' && 'data' in orderOrResponse
            ? (orderOrResponse as { data: Order }).data
            : (orderOrResponse as Order)
          const id = order?.id
          if (id && order) {
            queryClient.setQueryData(orderDetailKey(id), order)
            setErrorMessage(null)
            onClose()
            navigate({ to: '/orders/$orderId', params: { orderId: id } })
          }
        },
      }
    )
  }

  const handleCloseTableBill = () => {
    if (openOrders.length === 0) return
    setErrorMessage(null)
    closeOrdersBatchMutation.mutate(
      { orderIds: openOrders.map((o) => o.id), tableId: tableId ?? undefined },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['venue-tables'] })
        },
      }
    )
  }

  const handleOpenPayModal = () => {
    setPayPaymentMethodId(paymentMethods[0]?.id ?? null)
    setErrorMessage(null)
    setIsPayModalOpen(true)
  }

  const handleConfirmPay = () => {
    if (!tableId) return
    setErrorMessage(null)
    registerPaymentMutation.mutate(
      { tableId, paymentMethodId: payPaymentMethodId },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          setIsPayModalOpen(false)
          queryClient.invalidateQueries({ queryKey: ['venue-tables'] })
          queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
      }
    )
  }

  return (
    <AppSideBar
      title="Mesas"
      position="right"
      isOpen={isOpen}
      onClose={onClose}
    >
      {errorMessage && (
        <Stack gap="xs" mb="sm">
          <AppError message={errorMessage} />
        </Stack>
      )}
      {!tableId && (
        <Text size="sm" c="dimmed">
          Selecione uma mesa para ver os detalhes.
        </Text>
      )}

      {tableId && (
        <Stack gap="md">
          <Stack gap="xs">
            <Button
              size="xs"
              status="info"
              leftSection={<Icon name="plus" size={16} />}
              loading={createOrderMutation.isPending}
              onClick={handleOpenOrder}
            >
              Abrir pedido para esta mesa
            </Button>
            {canShowPayButton && (
              <Button
                size="xs"
                status="warning"
                leftSection={<Icon name="currency" size={16} />}
                loading={registerPaymentMutation.isPending}
                onClick={handleOpenPayModal}
              >
                Pagar conta
              </Button>
            )}
          </Stack>
          <Group gap="xs" justify="center">
            {openOrders.length > 0 && (
              <Button
                size="xs"
                status="success"
                leftSection={<Icon name="currency" size={16} />}
                loading={closeOrdersBatchMutation.isPending}
                onClick={handleCloseTableBill}
              >
                Fechar conta da mesa
              </Button>
            )}
            {currentTable && currentTable.status !== 'CALLING_WAITER' && currentTable.status !== 'FREE' && (
              <Button
                size="xs"
                status="secondary"
                variant="light"
                leftSection={<Icon name="menu" size={16} />}
                loading={updateVenueTableStatusMutation.isPending}
                onClick={() =>
                  updateVenueTableStatusMutation.mutate(
                    { id: tableId!, status: 'CALLING_WAITER' },
                    { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['venue-tables'] }) }
                  )
                }
              >
                Cliente chamou garçom
              </Button>
            )}
            {currentTable?.status === 'CALLING_WAITER' && (
              <Button
                size="xs"
                status="info"
                variant="light"
                leftSection={<Icon name="menu" size={16} />}
                loading={updateVenueTableStatusMutation.isPending}
                onClick={() =>
                  updateVenueTableStatusMutation.mutate(
                    { id: tableId!, status: 'OCCUPIED' },
                    { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['venue-tables'] }) }
                  )
                }
              >
                Marcar como atendido
              </Button>
            )}
          </Group>

          {tableOrders.length === 0 && !canShowPayButton ? (
            <Text size="sm" c="dimmed">
              Nenhum pedido nesta mesa.
            </Text>
          ) : (
            <>
              <Text size="sm" fw={500}>
                Pedidos da mesa
              </Text>
              <Stack gap="xs">
                {tableOrders.map((order) => (
                  <Group key={order.id} justify="space-between" wrap="nowrap">
                    <Stack gap={2}>
                      <Text size="sm">
                        Pedido {order.id.slice(0, 8)}
                      </Text>
                      <Text size="sm" fw={600}>
                        R$ {order.totalAmount != null ? order.totalAmount.toFixed(2) : '0,00'}
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      <Badge size="sm" color={order.invoiced ? 'green' : 'yellow'}>
                        {order.invoiced ? 'Faturado' : 'Em aberto'}
                      </Badge>
                      {!order.invoiced && otherTables.length > 0 && (
                        <Button
                          size="xs"
                          status="info"
                          variant="light"
                          leftSection={<Icon name="transfer" size={14} />}
                          onClick={() => handleOpenTransferModal(order.id)}
                        >
                          Transferir
                        </Button>
                      )}
                    </Group>
                  </Group>
                ))}
              </Stack>
              {openOrders.length > 0 && (
                <Text size="sm" fw={600}>
                  Total em aberto: R$ {totalOpen.toFixed(2)}
                </Text>
              )}
              {tableOrders.length > 0 && (
                <Text size="sm" fw={600}>
                  Total da conta: R$ {totalTable.toFixed(2)}
                </Text>
              )}
              <Group gap="xs" justify="center">
                <Button
                  size="xs"
                  status="warning"
                  variant="light"
                  leftSection={<Icon name="split" size={16} />}
                  onClick={handleOpenSplitModal}
                  disabled={tableOrders.length > 0 && openOrders.length === 0}
                >
                  Dividir mesa
                </Button>
                {tablesList.length > 1 && (
                  <Button
                    size="xs"
                    status="secondary"
                    variant="light"
                    leftSection={<Icon name="merge" size={16} />}
                    onClick={handleOpenMergeModal}
                    disabled={tableOrders.length > 0 && openOrders.length === 0}
                  >
                    Unificar mesa
                  </Button>
                )}
              </Group>
            </>
          )}
        </Stack>
      )}

      <AppModal
        opened={isTransferModalOpen}
        title="Transferir pedido para outra mesa"
        onClose={() => { setErrorMessage(null); setIsTransferModalOpen(false) }}
        confirmLabel="Transferir"
        onConfirm={handleConfirmTransfer}
        loading={transferOrderMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppSelect
            label="Mesa destino"
            placeholder="Selecione a mesa destino"
            data={otherTables.map((order) => ({
              value: order.tableId ?? '',
              label: `Mesa ${(order.tableId ?? '').slice(0, 8)}`,
            }))}
            value={targetTableId}
            onChange={setTargetTableId}
          />
        </Stack>
      </AppModal>

      <AppModal
        opened={isSplitModalOpen}
        title="Dividir mesa"
        onClose={() => { setErrorMessage(null); setIsSplitModalOpen(false) }}
        confirmLabel="Confirmar divisão"
        onConfirm={handleConfirmSplit}
        loading={splitVenueTableMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppNumberInput
            label="Número da nova mesa"
            min={1}
            value={splitTableNumber}
            onChange={setSplitTableNumber}
          />
          <AppNumberInput
            label="Capacidade da nova mesa (opcional)"
            min={1}
            value={splitCapacity}
            onChange={setSplitCapacity}
          />
          <Text size="xs" c="dimmed">
            Todos os pedidos desta mesa serão movidos para a nova mesa informada.
          </Text>
        </Stack>
      </AppModal>

      <AppModal
        opened={isPayModalOpen}
        title="Pagar conta"
        onClose={() => { setErrorMessage(null); setIsPayModalOpen(false) }}
        confirmLabel="Confirmar pagamento"
        onConfirm={handleConfirmPay}
        loading={registerPaymentMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <Text size="sm" fw={600}>
            Total da conta: R$ {totalTable.toFixed(2)}
          </Text>
          <AppSelect
            label="Forma de pagamento"
            placeholder="Selecione (opcional)"
            data={paymentMethods.map((pm) => ({ value: pm.id, label: pm.name }))}
            value={payPaymentMethodId}
            onChange={setPayPaymentMethodId}
          />
          <Text size="xs" c="dimmed">
            Ao confirmar, o pagamento será registrado no histórico e a mesa será liberada.
          </Text>
        </Stack>
      </AppModal>

      <AppModal
        opened={isMergeModalOpen}
        title="Unificar mesa"
        onClose={() => { setErrorMessage(null); setIsMergeModalOpen(false) }}
        confirmLabel="Unificar"
        onConfirm={handleConfirmMerge}
        loading={mergeVenueTablesMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppSelect
            label="Mesa destino"
            placeholder="Selecione a mesa destino"
            data={tablesList
              .filter((t) => t.id !== tableId)
              .map((t) => ({
                value: t.id,
                label: `Mesa ${t.tableNumber}`,
              }))}
            value={targetTableId}
            onChange={setTargetTableId}
          />
          <Text size="xs" c="dimmed">
            Todos os pedidos desta mesa serão movidos para a mesa selecionada.
          </Text>
        </Stack>
      </AppModal>
    </AppSideBar>
  )
}
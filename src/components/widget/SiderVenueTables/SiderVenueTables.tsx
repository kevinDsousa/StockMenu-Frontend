import { AppSideBar } from "@/components/ui/DefaultSideBar/AppSideBar"
import { AppModal, Button, AppError } from "@/components"
import { Group, Stack, Text } from "@mantine/core"
import { AppNumberInput, AppSelect } from "@/components"
import { useOrders, useCreateOrder, useTransferOrder, useVenueTables, useSplitVenueTable, useMergeVenueTables } from "@/hooks"
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

export const SiderVenueTables = ({ isOpen, onClose, tableId }: SiderVenueTablesProps) => {
  const { data } = useOrders()
  const { data: venueTables } = useVenueTables()
  const createOrderMutation = useCreateOrder()
  const transferOrderMutation = useTransferOrder()
  const splitVenueTableMutation = useSplitVenueTable()
  const mergeVenueTablesMutation = useMergeVenueTables()
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [targetTableId, setTargetTableId] = useState<string | null>(null)
  const [splitTableNumber, setSplitTableNumber] = useState<number | ''>('')
  const [splitCapacity, setSplitCapacity] = useState<number | ''>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const allOrders: Order[] = data ?? []
  const tableOrders = allOrders.filter((order) => order.tableId === tableId)
  const tablesList: VenueTable[] = venueTables ?? []
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
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: (createdOrder: Order) => {
          const order = createdOrder && !Array.isArray(createdOrder) && createdOrder.data
            ? createdOrder.data
            : createdOrder
          const id = order?.id
          if (id) {
            setErrorMessage(null)
            navigate({ to: '/orders/$orderId', params: { orderId: id } })
            onClose()
          }
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

      {tableId && tableOrders.length === 0 && (
        <div>
          <Text size="sm" c="dimmed" mb="sm">
            Nenhum pedido aberto para esta mesa.
          </Text>
          <Button
            size="xs"
            loading={createOrderMutation.isPending}
            onClick={handleOpenOrder}
          >
            Abrir pedido para esta mesa
          </Button>
        </div>
      )}

      {tableId && tableOrders.length > 0 && (
        <div>
          <Text size="sm" fw={500} mb="xs">
            Pedidos da mesa
          </Text>
          <Stack gap="xs">
            {tableOrders.map((order) => (
              <Group key={order.id} justify="space-between">
                <Text size="sm">
                  Pedido {order.id.slice(0, 8)} - Total: {order.totalAmount?.toFixed(2) ?? '0,00'}
                </Text>
                {otherTables.length > 0 && (
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleOpenTransferModal(order.id)}
                  >
                    Transferir
                  </Button>
                )}
              </Group>
            ))}
          </Stack>
          <Group justify="space-between" mt="md">
            <Button
              size="xs"
              variant="outline"
              onClick={handleOpenSplitModal}
            >
              Dividir mesa
            </Button>
            {tablesList.length > 1 && (
              <Button
                size="xs"
                variant="outline"
                onClick={handleOpenMergeModal}
              >
                Unificar mesa
              </Button>
            )}
          </Group>
        </div>
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
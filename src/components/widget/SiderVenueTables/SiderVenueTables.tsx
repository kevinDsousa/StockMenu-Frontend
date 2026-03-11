import { AppSideBar } from "@/components/ui/DefaultSideBar/AppSideBar"
import { Text } from "@mantine/core"
import { useOrders } from "@/hooks"

interface SiderVenueTablesProps {
  isOpen: boolean
  onClose: () => void
  tableId: string | null
}

export const SiderVenueTables = ({ isOpen, onClose, tableId }: SiderVenueTablesProps) => {
  const { data } = useOrders()
  const allOrders = Array.isArray(data) ? data : (data as any)?.data ?? []
  const tableOrders = allOrders.filter((order: any) => order.tableId === tableId)

  return (
    <AppSideBar
      title="Mesas"
      position="right"
      isOpen={isOpen}
      onClose={onClose}
    >
      {!tableId && (
        <Text size="sm" c="dimmed">
          Selecione uma mesa para ver os detalhes.
        </Text>
      )}

      {tableId && tableOrders.length === 0 && (
        <Text size="sm" c="dimmed">
          Nenhum pedido aberto para esta mesa.
        </Text>
      )}

      {tableId && tableOrders.length > 0 && (
        <div>
          <Text size="sm" fw={500} mb="xs">
            Pedidos da mesa
          </Text>
          {tableOrders.map((order) => (
            <Text key={order.id} size="sm">
              Pedido {order.id.slice(0, 8)} - Total: {order.totalAmount?.toFixed(2) ?? '0,00'}
            </Text>
          ))}
        </div>
      )}
    </AppSideBar>
  )
}
import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge, Stack, Table, Text } from '@mantine/core'
import { PageContainer, AppLoader } from '@/components'
import { useAuthStore } from '@/store/auth'
import { useOrders } from '@/hooks'

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading } = useOrders(user?.companyId ?? undefined)

  const orders = Array.isArray(data) ? data : (data as any)?.data ?? []

  return (
    <PageContainer title="Pedidos">
      {isLoading && <AppLoader />}

      {!isLoading && (!orders || orders.length === 0) && (
        <Text c="dimmed">Nenhum pedido encontrado para esta empresa.</Text>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <Stack gap="sm">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Código</Table.Th>
                <Table.Th>Mesa</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order: any) => (
                <Table.Tr key={order.id} component={Link} to="/orders/$orderId" params={{ orderId: order.id }}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {order.id.slice(0, 8)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.tableId ? `Mesa ${order.tableId.slice(0, 4)}` : '-'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.type}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.customerName ?? '-'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">R$ {order.totalAmount?.toFixed(2) ?? '0,00'}</Text>
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
        </Stack>
      )}
    </PageContainer>
  )
}


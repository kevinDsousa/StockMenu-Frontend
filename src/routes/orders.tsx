import { createFileRoute, useNavigate, Outlet, useRouterState } from '@tanstack/react-router'
import { Badge, Card, Stack, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { useCallback, useState } from 'react'
import { PageContainer, AppLoader, AppPagination } from '@/components'
import { useAuthStore } from '@/store/auth'
import { useOrdersPage } from '@/hooks'
import { useQueries } from '@tanstack/react-query'
import { getOrderItems } from '@/api/order-items'
import type { Order, OrderItem } from '@/entities'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'

const MAX_ITEMS_PREVIEW = 2

function OrderItemsCell({ items }: { items: OrderItem[] }) {
  const preview = items.slice(0, MAX_ITEMS_PREVIEW)
  const rest = items.length - MAX_ITEMS_PREVIEW
  const previewText = preview
    .map((i) => `${i.productName ?? i.productId?.slice(0, 8)} (${i.quantity})`)
    .join(', ')
  const fullLines = items.map(
    (i) => `${i.productName ?? i.productId?.slice(0, 8)} — ${i.quantity} × R$ ${Number(i.unitPrice).toFixed(2)}`
  )
  if (items.length === 0) return <Text size="sm" c="dimmed">—</Text>
  return (
    <Tooltip
      label={
        <Stack gap={2}>
          {fullLines.map((line, idx) => (
            <Text key={idx} size="xs">
              {line}
            </Text>
          ))}
        </Stack>
      }
      maw={320}
      withArrow
    >
      <Text size="sm" style={{ cursor: 'help', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
        {previewText}
        {rest > 0 ? ` +${rest} mais` : ''}
      </Text>
    </Tooltip>
  )
}

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

const PAGE_SIZE = 20
const SIZE_OPTIONS = [10, 20, 50]

function OrdersPage() {
  const routerState = useRouterState()

  if (routerState.location.pathname !== '/orders') {
    return <Outlet />
  }

  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = mustUseOwnCompany(user?.role) && !companyId

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(PAGE_SIZE)
  const [search, setSearch] = useState('')
  const searchTrimmed = search.trim() || undefined

  const {
    content: orders,
    totalElements,
    totalPages,
    size: currentSize,
    isLoading,
  } = useOrdersPage(needsCompany ? undefined : companyId ?? undefined, {
    page,
    size,
    tableSearch: searchTrimmed,
    customerSearch: searchTrimmed,
    itemSearch: searchTrimmed,
  })

  const onPageChange = useCallback((p: number) => setPage(p), [])
  const onSizeChange = useCallback((s: number) => {
    setSize(s)
    setPage(0)
  }, [])
  const onSearchChange = useCallback((v: string) => {
    setSearch(v)
    setPage(0)
  }, [])

  const itemsQueries = useQueries({
    queries: orders.map((o) => ({
      queryKey: ['order-items', 'list', o.id] as const,
      queryFn: () => getOrderItems(o.id),
      enabled: orders.length > 0,
    })),
  })
  const orderItemsMap = new Map<string, OrderItem[]>()
  orders.forEach((o, i) => {
    orderItemsMap.set(o.id, itemsQueries[i]?.data ?? [])
  })

  if (needsCompany) {
    return (
      <PageContainer title="Pedidos">
        <Card>
          <Text c="dimmed" size="sm">
            {getNoCompanyMessage()}
          </Text>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Pedidos">
      {isLoading && <AppLoader />}

      <Stack gap="sm">
        <TextInput
          placeholder="Buscar por mesa, cliente ou itens..."
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          leftSection={<span aria-hidden>🔍</span>}
          styles={{ root: { maxWidth: 320 } }}
        />

        {!isLoading && (!orders || orders.length === 0) && (
          <Stack gap="xs">
            <Text c="dimmed">
              {searchTrimmed ? 'Nenhum pedido encontrado com os filtros informados.' : 'Nenhum pedido encontrado para esta empresa.'}
            </Text>
            {!searchTrimmed && (
              <Text size="sm" c="dimmed">
                O garçom pode abrir pedidos pelo dashboard, clicando na mesa e em &quot;Abrir pedido para esta mesa&quot;.
                Futuramente o cliente também poderá abrir pedido pelo cardápio digital online (via QR code).
              </Text>
            )}
          </Stack>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Código</Table.Th>
                <Table.Th>Mesa</Table.Th>
                <Table.Th>Garçom</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Itens</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr
                  key={order.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate({ to: '/orders/$orderId', params: { orderId: order.id } })}
                >
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {order.id.slice(0, 8)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {order.tableNumber != null ? `Mesa ${order.tableNumber}` : order.tableId ? order.tableId.slice(0, 8) : '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.createdByUserName ?? order.createdByUserId?.slice(0, 8) ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.type}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.customerName ?? '-'}</Text>
                  </Table.Td>
                  <Table.Td onClick={(e) => e.stopPropagation()}>
                    <OrderItemsCell items={orderItemsMap.get(order.id) ?? []} />
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
          <AppPagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={currentSize}
            onPageChange={onPageChange}
            onSizeChange={onSizeChange}
            sizeOptions={SIZE_OPTIONS}
          />
          </>
        )}
      </Stack>
    </PageContainer>
  )
}


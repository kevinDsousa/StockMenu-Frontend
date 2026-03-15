import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge, Group, Loader, Stack, Table, Text, Title } from '@mantine/core'
import { PageContainer, Card, Button, AppInput, AppNumberInput, AppTextarea, AppSelect } from '@/components'
import { useOrder, useOrderItems, useCloseOrdersBatch, useCreateOrderItem, useCancelOrderItem, useUpdateOrderItem, useProducts } from '@/hooks'
import type { Order, OrderItem, Product } from '@/entities'
import { useState } from 'react'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()

  const [productId, setProductId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number | ''>(1)
  const [unitPrice, setUnitPrice] = useState<number | ''>('')
  const [customerName, setCustomerName] = useState('')
  const [observation, setObservation] = useState('')

  const { data: orderData, isLoading: isLoadingOrder } = useOrder(orderId)
  const { data: itemsData, isLoading: isLoadingItems } = useOrderItems(orderId)
  const { data: productsData } = useProducts(orderData?.companyId)

  const closeOrdersBatchMutation = useCloseOrdersBatch()
  const createItemMutation = useCreateOrderItem()
  const cancelItemMutation = useCancelOrderItem(orderId)
  const updateItemMutation = useUpdateOrderItem()

  const order: Order | undefined = orderData
  const items: OrderItem[] = itemsData ?? []
  const products: Product[] = productsData ?? []

  const isLoading = isLoadingOrder || isLoadingItems
  const productOptions = products.map((p) => ({ value: p.id, label: `${p.name} — R$ ${Number(p.price).toFixed(2)}` }))
  const selectedProduct = products.find((p) => p.id === productId)

  const handleProductChange = (value: string | null) => {
    setProductId(value)
    if (value) {
      const p = products.find((x) => x.id === value)
      setUnitPrice(p != null ? Number(p.price) : '')
    } else {
      setUnitPrice('')
    }
  }

  const handleAddItem = () => {
    if (!order || !productId || !quantity || quantity < 1) return

    createItemMutation.mutate({
      orderId: order.id,
      productId,
      quantity: Number(quantity),
      unitPrice: unitPrice !== '' && unitPrice != null ? Number(unitPrice) : undefined,
      customerName: customerName || null,
      observation: observation || null,
    })

    setProductId(null)
    setQuantity(1)
    setUnitPrice(selectedProduct != null ? Number(selectedProduct.price) : '')
    setCustomerName('')
    setObservation('')
  }

  const handleInvoiceOrder = () => {
    if (!order) return
    closeOrdersBatchMutation.mutate([order.id])
  }

  const handleCancelItem = (itemId: string) => {
    cancelItemMutation.mutate(itemId)
  }

  const handleChangeItemStatus = (itemId: string, status: 'PENDING' | 'IN_PREPARATION' | 'DELIVERED') => {
    updateItemMutation.mutate({ id: itemId, dto: { status } })
  }

  return (
    <PageContainer title="Fazer pedido">
      {isLoading && (
        <Group justify="center" my="lg">
          <Loader />
        </Group>
      )}

      {!isLoading && !order && (
        <Stack gap="sm">
          <Text c="dimmed">Pedido não encontrado.</Text>
          <Button variant="light" component={Link} to="/orders">
            Voltar à lista de pedidos
          </Button>
          <Button variant="subtle" component={Link} to="/">
            Ir ao dashboard
          </Button>
        </Stack>
      )}

      {!isLoading && order && (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Adicione os produtos abaixo. Depois você pode faturar o pedido ou fechar a conta da mesa no dashboard.
          </Text>
          <Card>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={4}>Pedido {order.id.slice(0, 8)}</Title>
                <Text size="sm" c="dimmed">
                  Mesa: {order.tableNumber != null ? order.tableNumber : order.tableId ? order.tableId.slice(0, 8) : '—'}
                </Text>
                <Text size="sm" c="dimmed">
                  Garçom: {order.createdByUserName ?? order.createdByUserId?.slice(0, 8) ?? '—'}
                </Text>
                <Text size="sm" c="dimmed">
                  Tipo: {order.type}
                </Text>
                <Text size="sm" c="dimmed">
                  Cliente: {order.customerName ?? '—'}
                </Text>
              </div>
              <Stack gap={8} align="flex-end">
                <Badge color={order.invoiced ? 'green' : 'yellow'}>
                  {order.invoiced ? 'Faturado' : 'Em aberto'}
                </Badge>
                <Text fw={600}>Total: R$ {order.totalAmount?.toFixed(2) ?? '0,00'}</Text>
                {!order.invoiced && (
                  <Button
                    size="xs"
                    loading={closeOrdersBatchMutation.isPending}
                    onClick={handleInvoiceOrder}
                  >
                    Faturar pedido
                  </Button>
                )}
              </Stack>
            </Group>
          </Card>

          <Card>
            <Stack gap="md">
              <div>
                <Title order={5}>Novo item</Title>
                <Group grow mb="sm" mt="xs">
                  <AppSelect
                    label="Produto"
                    placeholder="Selecione o produto"
                    data={productOptions}
                    value={productId}
                    onChange={handleProductChange}
                    searchable
                    clearable
                  />
                  <AppNumberInput
                    label="Quantidade"
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                  />
                  <AppNumberInput
                    label="Valor unitário"
                    min={0}
                    precision={2}
                    value={unitPrice}
                    onChange={setUnitPrice}
                  />
                </Group>
                <Group grow mb="sm">
                  <AppInput
                    label="Nome na mesa"
                    placeholder="Opcional"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.currentTarget.value)}
                  />
                  <AppTextarea
                    label="Observação"
                    placeholder="Ex.: sem gelo, ponto da carne..."
                    minRows={1}
                    value={observation}
                    onChange={(event) => setObservation(event.currentTarget.value)}
                  />
                </Group>
                <Group justify="flex-end">
                  <Button
                    size="xs"
                    loading={createItemMutation.isPending}
                    onClick={handleAddItem}
                  >
                    Adicionar item
                  </Button>
                </Group>
              </div>

              <div>
                <Group justify="space-between" mb="sm">
                  <Title order={5}>Itens do pedido</Title>
                </Group>

                {items.length === 0 && (
                  <Text c="dimmed">Nenhum item neste pedido.</Text>
                )}

                {items.length > 0 && (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Produto</Table.Th>
                        <Table.Th>Qtd</Table.Th>
                        <Table.Th>V. Unit.</Table.Th>
                        <Table.Th>Total</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Ações</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {items.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <Text size="sm">{item.productName ?? item.productId?.slice(0, 8)}</Text>
                            {item.customerName && (
                              <Text size="xs" c="dimmed">
                                {item.customerName}
                              </Text>
                            )}
                            {item.observation && (
                              <Text size="xs" c="dimmed">
                                {item.observation}
                              </Text>
                            )}
                          </Table.Td>
                          <Table.Td>{item.quantity}</Table.Td>
                          <Table.Td>R$ {item.unitPrice?.toFixed(2) ?? '0,00'}</Table.Td>
                          <Table.Td>R$ {item.totalPrice?.toFixed(2) ?? '0,00'}</Table.Td>
                          <Table.Td>
                            <Badge
                              color={
                                item.status === 'CANCELLED'
                                  ? 'red'
                                  : item.status === 'DELIVERED'
                                    ? 'green'
                                    : item.status === 'IN_PREPARATION'
                                      ? 'orange'
                                      : 'yellow'
                              }
                            >
                              {item.status === 'CANCELLED'
                                ? 'Cancelado'
                                : item.status === 'DELIVERED'
                                  ? 'Entregue'
                                  : item.status === 'IN_PREPARATION'
                                    ? 'Em preparo'
                                    : 'Pendente'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <Button
                                size="xs"
                                variant="light"
                                color="yellow"
                                disabled={item.status === 'CANCELLED'}
                                loading={updateItemMutation.isPending}
                                onClick={() => handleChangeItemStatus(item.id, 'PENDING')}
                              >
                                Pendente
                              </Button>
                              <Button
                                size="xs"
                                variant="light"
                                color="orange"
                                disabled={item.status === 'CANCELLED'}
                                loading={updateItemMutation.isPending}
                                onClick={() => handleChangeItemStatus(item.id, 'IN_PREPARATION')}
                              >
                                Em preparo
                              </Button>
                              <Button
                                size="xs"
                                variant="light"
                                color="green"
                                disabled={item.status === 'CANCELLED'}
                                loading={updateItemMutation.isPending}
                                onClick={() => handleChangeItemStatus(item.id, 'DELIVERED')}
                              >
                                Entregue
                              </Button>
                              <Button
                                size="xs"
                                variant="light"
                                color="red"
                                disabled={item.status === 'CANCELLED'}
                                loading={cancelItemMutation.isPending}
                                onClick={() => handleCancelItem(item.id)}
                              >
                                Cancelar
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </div>
            </Stack>
          </Card>
        </Stack>
      )}
    </PageContainer>
  )
}


import { createFileRoute } from '@tanstack/react-router'
import { Badge, Button, Card as MantineCard, Group, Loader, NumberInput, Stack, Table, Text, Textarea, TextInput, Title } from '@mantine/core'
import { PageContainer, Card } from '@/components'
import { useOrder, useOrderItems, useUpdateOrder, useCreateOrderItem, useCancelOrderItem, useUpdateOrderItem } from '@/hooks'
import { useState } from 'react'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()

  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState<number | ''>(1)
  const [unitPrice, setUnitPrice] = useState<number | ''>(0)
  const [customerName, setCustomerName] = useState('')
  const [observation, setObservation] = useState('')

  const {
    data: orderData,
    isLoading: isLoadingOrder,
  } = useOrder(orderId)

  const {
    data: itemsData,
    isLoading: isLoadingItems,
  } = useOrderItems(orderId)

  const updateOrderMutation = useUpdateOrder()
  const createItemMutation = useCreateOrderItem()
  const cancelItemMutation = useCancelOrderItem(orderId)
  const updateItemMutation = useUpdateOrderItem()

  const order = orderData && !Array.isArray(orderData) && (orderData as any).data ? (orderData as any).data : orderData
  const items = Array.isArray(itemsData) ? itemsData : (itemsData as any)?.data ?? []

  const isLoading = isLoadingOrder || isLoadingItems

  const handleAddItem = () => {
    if (!order) return
    if (!productId || !quantity || !unitPrice) return

    createItemMutation.mutate({
      orderId: order.id,
      productId,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalPrice: Number(quantity) * Number(unitPrice),
      customerName: customerName || null,
      observation: observation || null,
    })

    setProductId('')
    setQuantity(1)
    setUnitPrice(0)
    setCustomerName('')
    setObservation('')
  }

  const handleInvoiceOrder = () => {
    if (!order) return
    updateOrderMutation.mutate({ id: order.id, dto: { invoiced: true } })
  }

  const handleCancelItem = (itemId: string) => {
    cancelItemMutation.mutate(itemId)
  }

  const handleChangeItemStatus = (itemId: string, status: 'PENDING' | 'IN_PREPARATION' | 'DELIVERED') => {
    updateItemMutation.mutate({ id: itemId, dto: { status } })
  }

  return (
    <PageContainer title="Detalhe do pedido">
      {isLoading && (
        <Group justify="center" my="lg">
          <Loader />
        </Group>
      )}

      {!isLoading && !order && (
        <Text c="dimmed">Pedido não encontrado.</Text>
      )}

      {!isLoading && order && (
        <Stack gap="md">
          <Card>
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={4}>Pedido {order.id.slice(0, 8)}</Title>
                <Text size="sm" c="dimmed">
                  Mesa: {order.tableId ? order.tableId.slice(0, 8) : '—'}
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
                    loading={updateOrderMutation.isPending}
                    onClick={handleInvoiceOrder}
                  >
                    Faturar pedido
                  </Button>
                )}
              </Stack>
            </Group>
          </Card>

          <MantineCard withBorder>
            <Stack gap="md">
              <div>
                <Title order={5}>Novo item</Title>
                <Group grow mb="sm" mt="xs">
                  <TextInput
                    label="Produto (ID)"
                    placeholder="UUID do produto"
                    value={productId}
                    onChange={(event) => setProductId(event.currentTarget.value)}
                  />
                  <NumberInput
                    label="Quantidade"
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                  />
                  <NumberInput
                    label="Valor unitário"
                    min={0}
                    precision={2}
                    value={unitPrice}
                    onChange={setUnitPrice}
                  />
                </Group>
                <Group grow mb="sm">
                  <TextInput
                    label="Nome na mesa"
                    placeholder="Opcional"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.currentTarget.value)}
                  />
                  <Textarea
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
                      {items.map((item: any) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <Text size="sm">{item.productId?.slice(0, 8)}</Text>
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
                                  : 'blue'
                              }
                            >
                              {item.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <Button
                                size="xs"
                                variant="light"
                                disabled={item.status === 'CANCELLED'}
                                loading={updateItemMutation.isPending}
                                onClick={() => handleChangeItemStatus(item.id, 'PENDING')}
                              >
                                Pendente
                              </Button>
                              <Button
                                size="xs"
                                variant="light"
                                disabled={item.status === 'CANCELLED'}
                                loading={updateItemMutation.isPending}
                                onClick={() => handleChangeItemStatus(item.id, 'IN_PREPARATION')}
                              >
                                Em preparo
                              </Button>
                              <Button
                                size="xs"
                                variant="light"
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
          </MantineCard>
        </Stack>
      )}
    </PageContainer>
  )
}


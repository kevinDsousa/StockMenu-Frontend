import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import {
  AppError,
  AppInput,
  AppLoader,
  AppModal,
  Button,
  PageContainer,
  Card,
} from '@/components'
import { useAuthStore } from '@/store/auth'
import {
  usePrimaryProducts,
  useCreatePrimaryProduct,
  useUpdatePrimaryProduct,
  useDeletePrimaryProduct,
  useUnitMeasures,
} from '@/hooks'
import { useState } from 'react'
import { extractApiErrorMessage } from '@/utils/api-error'

export const Route = createFileRoute('/inventory')({
  component: InventoryComponent,
})

function InventoryComponent() {
  const user = useAuthStore((state) => state.user)
  const companyId = user?.companyId ?? null

  const { data, isLoading } = usePrimaryProducts(companyId ?? undefined)
  const { data: unitMeasures = [] } = useUnitMeasures()
  const createPrimaryProductMutation = useCreatePrimaryProduct()
  const updatePrimaryProductMutation = useUpdatePrimaryProduct()
  const deletePrimaryProductMutation = useDeletePrimaryProduct()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [unit, setUnit] = useState<string>('UN')
  const [currentStock, setCurrentStock] = useState<number | ''>('')
  const [lowStockAlert, setLowStockAlert] = useState<number | ''>('')
  const [productType, setProductType] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({})

  const items = Array.isArray(data) ? data : (data as any)?.data ?? []

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setUnit(unitMeasures[0]?.key ?? 'UN')
    setCurrentStock('')
    setLowStockAlert('')
    setProductType(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setErrorMessage(null)
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id)
    setName(item.name ?? '')
    setUnit(item.unit ?? unitMeasures[0]?.key ?? 'UN')
    setCurrentStock(item.currentStock ?? '')
    setLowStockAlert(item.lowStockAlert ?? '')
    setProductType(item.productType ?? null)
    setErrorMessage(null)
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setErrorMessage(null)
    setFieldErrors({})
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    if (!companyId) return
    const nameTrim = name.trim()
    const errors: { name?: string } = {}
    if (!nameTrim) errors.name = 'Preencha o nome'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const baseDto: any = {
      companyId,
      name: nameTrim,
      unit,
      currentStock: currentStock === '' ? 0 : Number(currentStock),
      lowStockAlert: lowStockAlert === '' ? null : Number(lowStockAlert),
      productType: productType,
      expirationDate: new Date().toISOString().slice(0, 10),
    }

    setErrorMessage(null)

    if (editingId) {
      const dto = {
        ...baseDto,
      }
      updatePrimaryProductMutation.mutate(
        { id: editingId, dto },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => {
            setErrorMessage(null)
            setIsModalOpen(false)
          },
        }
      )
    } else {
      createPrimaryProductMutation.mutate(baseDto, {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => {
          setErrorMessage(null)
          setIsModalOpen(false)
        },
      })
    }
  }

  const handleDelete = (id: string) => {
    if (!id) return
    setErrorMessage(null)
    deletePrimaryProductMutation.mutate(id, {
      onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
    })
  }

  return (
    <PageContainer title="Estoque">
      <Stack gap="sm" mb="md">
        <Text c="dimmed">
          Gestão de insumos (estoque bruto) da empresa logada.
        </Text>
        <Group justify="flex-start">
          <Button size="xs" onClick={handleOpenNew}>
            Novo insumo
          </Button>
        </Group>
      </Stack>

      {errorMessage && (
        <Stack gap="sm" mb="md">
          <AppError message={errorMessage} />
        </Stack>
      )}

      {isLoading && <AppLoader />}

      {!isLoading && (!items || items.length === 0) && (
        <Text c="dimmed">Nenhum insumo cadastrado para esta empresa.</Text>
      )}

      {!isLoading && items && items.length > 0 && (
        <Card>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Estoque atual</Table.Th>
                <Table.Th>Unidade</Table.Th>
                <Table.Th>Alerta de baixa</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item: any) => {
                const lowStock = item.isStockLow
                const expired = item.isExpired
                const expiringSoon = item.isExpiringSoon

                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>
                      {item.currentStock} {item.unit?.toLowerCase?.()}
                    </Table.Td>
                    <Table.Td>{item.unit}</Table.Td>
                    <Table.Td>{item.lowStockAlert ?? '—'}</Table.Td>
                    <Table.Td>{item.productType ?? '—'}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {lowStock && <Badge color="yellow">Em baixa</Badge>}
                        {expired && <Badge color="red">Vencido</Badge>}
                        {!expired && expiringSoon && (
                          <Badge color="orange">Vencendo</Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => handleOpenEdit(item)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          loading={deletePrimaryProductMutation.isPending}
                          onClick={() => handleDelete(item.id)}
                        >
                          Excluir
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      <AppModal
        opened={isModalOpen}
        title={editingId ? 'Editar insumo' : 'Novo insumo'}
        onClose={handleCloseModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmit}
        loading={
          createPrimaryProductMutation.isPending ||
          updatePrimaryProductMutation.isPending
        }
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppInput
            label="Nome"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={fieldErrors.name}
          />
          <Select
            label="Unidade"
            data={unitMeasures.map((u) => ({ value: u.key, label: u.value }))}
            value={unit}
            onChange={(value) => setUnit(value ?? unitMeasures[0]?.key ?? 'UN')}
          />
          <NumberInput
            label="Estoque atual"
            min={0}
            value={currentStock}
            onChange={setCurrentStock}
          />
          <NumberInput
            label="Alerta de baixa (opcional)"
            min={0}
            value={lowStockAlert}
            onChange={setLowStockAlert}
          />
          <AppInput
            label="Tipo de produto (opcional)"
            value={productType ?? ''}
            onChange={(event) => setProductType(event.currentTarget.value || null)}
          />
        </Stack>
      </AppModal>
    </PageContainer>
  )
}

import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Badge, Group, Modal, Stack, Table, Tabs, Text } from '@mantine/core'
import {
  AppError,
  AppInput,
  AppLoader,
  AppModal,
  Button,
  Card,
  Icon,
  PageContainer,
  AppSelect,
  AppNumberInput,
  AppCheckbox,
} from '@/components'
import { useAuthStore } from '@/store/auth'
import {
  usePrimaryProducts,
  useCreatePrimaryProduct,
  useUpdatePrimaryProduct,
  useDeletePrimaryProduct,
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUnitMeasures,
} from '@/hooks'
import { useState } from 'react'
import type { PrimaryProduct, Product } from '@/entities'
import type {
  CreatePrimaryProductDto,
  UpdatePrimaryProductDto,
  CreateProductDto,
  UpdateProductDto,
} from '@/types/dto'
import { STORAGE_TYPE_LABELS } from '@/types/dto/primary-product'
import { extractApiErrorMessage } from '@/utils/api-error'
import { readFileAsBase64 } from '@/utils/file'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'

const TAB_INSUMOS = 'insumos'
const TAB_PRODUTOS = 'produtos'

export const Route = createFileRoute('/inventory')({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    const t = search?.tab
    return { tab: t === TAB_PRODUTOS ? TAB_PRODUTOS : TAB_INSUMOS }
  },
  component: InventoryComponent,
})

function InventoryComponent() {
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = mustUseOwnCompany(user?.role) && !companyId
  const { tab } = useSearch({ from: '/inventory' })
  const navigate = useNavigate()
  const activeTab = tab ?? TAB_INSUMOS

  if (needsCompany) {
    return (
      <PageContainer title="Estoque">
        <Card>
          <Text c="dimmed" size="sm">
            {getNoCompanyMessage()}
          </Text>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Estoque">
      <Tabs
        value={activeTab}
        onChange={(value) =>
          navigate({ to: '/inventory', search: { tab: value ?? TAB_INSUMOS } })
        }
      >
        <Tabs.List>
          <Tabs.Tab value={TAB_INSUMOS} leftSection={<Icon name="package" size={16} />}>
            Insumos
          </Tabs.Tab>
          <Tabs.Tab value={TAB_PRODUTOS} leftSection={<Icon name="package" size={16} />}>
            Produtos (cardápio)
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TAB_INSUMOS} pt="md">
          <InsumosTab companyId={companyId ?? ''} />
        </Tabs.Panel>

        <Tabs.Panel value={TAB_PRODUTOS} pt="md">
          <ProdutosTab companyId={companyId ?? ''} />
        </Tabs.Panel>
      </Tabs>
    </PageContainer>
  )
}

function InsumosTab({ companyId }: { companyId: string }) {
  const { data, isLoading } = usePrimaryProducts(companyId)
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
  const [stockEntryDate, setStockEntryDate] = useState<string>('')
  const [storageType, setStorageType] = useState<string>('AMBIENT')
  const [maxStorageDays, setMaxStorageDays] = useState<number | ''>('')
  const [imageFileName, setImageFileName] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageContentType, setImageContentType] = useState<string | null>(null)
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({})

  const items: PrimaryProduct[] = data ?? []

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setUnit(unitMeasures[0]?.key ?? 'UN')
    setCurrentStock('')
    setLowStockAlert('')
    setProductType(null)
    setStockEntryDate('')
    setStorageType('AMBIENT')
    setMaxStorageDays('')
    setImageFileName(null)
    setImagePreviewUrl(null)
    setImageBase64(null)
    setImageContentType(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setStockEntryDate(new Date().toISOString().slice(0, 10))
    setErrorMessage(null)
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: PrimaryProduct) => {
    setEditingId(item.id)
    setName(item.name ?? '')
    setUnit(item.unit ?? unitMeasures[0]?.key ?? 'UN')
    setCurrentStock(item.currentStock ?? '')
    setLowStockAlert(item.lowStockAlert ?? '')
    setProductType(item.productType ?? null)
    setStockEntryDate(item.stockEntryDate?.slice(0, 10) ?? '')
    setStorageType(item.storageType ?? 'AMBIENT')
    setMaxStorageDays(item.maxStorageDays ?? '')
    setImagePreviewUrl(item.imageUrl ?? null)
    setImageBase64(null)
    setImageContentType(null)
    setImageFileName(null)
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
    const nameTrim = name.trim()
    const errors: { name?: string } = {}
    if (!nameTrim) errors.name = 'Preencha o nome'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const baseDto: CreatePrimaryProductDto = {
      companyId,
      name: nameTrim,
      unit,
      currentStock: currentStock === '' ? 0 : Number(currentStock),
      lowStockAlert: lowStockAlert === '' ? null : Number(lowStockAlert),
      productType: productType,
      expirationDate: new Date().toISOString().slice(0, 10),
      stockEntryDate: stockEntryDate ? stockEntryDate : undefined,
      storageType: storageType || undefined,
      maxStorageDays: maxStorageDays === '' ? undefined : Number(maxStorageDays),
      ...(imageBase64 ? { image: imageBase64, imageContentType: imageContentType ?? undefined } : {}),
    }

    setErrorMessage(null)

    if (editingId) {
      const updateDto: UpdatePrimaryProductDto = {
        name: nameTrim,
        unit,
        currentStock: currentStock === '' ? 0 : Number(currentStock),
        lowStockAlert: lowStockAlert === '' ? null : Number(lowStockAlert),
        productType: productType,
        expirationDate: new Date().toISOString().slice(0, 10),
        stockEntryDate: stockEntryDate ? stockEntryDate : undefined,
        storageType: storageType || undefined,
        maxStorageDays: maxStorageDays === '' ? undefined : Number(maxStorageDays),
        ...(imageBase64 ? { image: imageBase64, imageContentType: imageContentType ?? undefined } : {}),
      }
      updatePrimaryProductMutation.mutate(
        { id: editingId, dto: updateDto },
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
    <Stack gap="sm">
      <Text c="dimmed" size="sm">
        Cadastre os insumos (matéria-prima) que serão usados nos produtos do cardápio.
      </Text>
      <Group>
        <Button
          size="xs"
          status="default"
          leftSection={<Icon name="plus" size={16} />}
          onClick={handleOpenNew}
        >
          Novo insumo
        </Button>
      </Group>

      {errorMessage && <AppError message={errorMessage} />}

      {isLoading && <AppLoader />}

      {!isLoading && (!items || items.length === 0) && (
        <Text c="dimmed">Nenhum insumo cadastrado. Cadastre insumos para depois criar produtos do cardápio.</Text>
      )}

      {!isLoading && items.length > 0 && (
        <Card>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
<Table.Thead>
            <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Estoque atual</Table.Th>
                <Table.Th>Unidade</Table.Th>
                <Table.Th>Data entrada</Table.Th>
                <Table.Th>Armazenamento</Table.Th>
                <Table.Th>Validade (dias)</Table.Th>
                <Table.Th>Alerta de baixa</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ width: 220, whiteSpace: 'nowrap' }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item) => {
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
                    <Table.Td>
                      {item.stockEntryDate
                        ? new Date(item.stockEntryDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </Table.Td>
                    <Table.Td>
                      {item.storageType ? STORAGE_TYPE_LABELS[item.storageType] ?? item.storageType : '—'}
                    </Table.Td>
                    <Table.Td>{item.maxStorageDays ?? '—'}</Table.Td>
                    <Table.Td>{item.lowStockAlert ?? '—'}</Table.Td>
                    <Table.Td>{item.productType ?? '—'}</Table.Td>
                    <Table.Td style={{ width: 220, whiteSpace: 'nowrap' }}>
                      <Group gap="xs" justify="center" wrap="nowrap">
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
                          status="warning"
                          leftSection={<Icon name="pencil" size={16} />}
                          onClick={() => handleOpenEdit(item)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="xs"
                          status="danger"
                          leftSection={<Icon name="trash" size={16} />}
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
          <AppSelect
            label="Unidade"
            data={unitMeasures.map((u) => ({ value: u.key, label: u.value }))}
            value={unit}
            onChange={(value) => setUnit(value ?? unitMeasures[0]?.key ?? 'UN')}
          />
          <AppNumberInput
            label="Estoque atual"
            min={0}
            value={currentStock}
            onChange={setCurrentStock}
          />
          <AppNumberInput
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
          <AppInput
            label="Data de entrada no estoque"
            type="date"
            value={stockEntryDate}
            onChange={(event) => setStockEntryDate(event.currentTarget.value)}
          />
          <AppSelect
            label="Tipo de armazenamento"
            data={[
              { value: 'FREEZER', label: STORAGE_TYPE_LABELS.FREEZER },
              { value: 'REFRIGERATED', label: STORAGE_TYPE_LABELS.REFRIGERATED },
              { value: 'AMBIENT', label: STORAGE_TYPE_LABELS.AMBIENT },
            ]}
            value={storageType}
            onChange={(value) => setStorageType(value ?? 'AMBIENT')}
          />
          <AppNumberInput
            label="Tempo máximo no armazenamento (dias)"
            min={1}
            value={maxStorageDays}
            onChange={setMaxStorageDays}
          />
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              Imagem (opcional)
            </Text>
            <Button
              size="xs"
              status="secondary"
              variant="light"
              leftSection={<Icon name="plus" size={14} />}
              onClick={() => {
                document.getElementById('insumo-image-input')?.click()
              }}
            >
              {imageFileName ?? 'Selecionar imagem'}
            </Button>
            <input
              id="insumo-image-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImageFileName(file.name)
                readFileAsBase64(file).then(({ base64, contentType }) => {
                  setImageBase64(base64)
                  setImageContentType(contentType)
                  setImagePreviewUrl(`data:${contentType};base64,${base64}`)
                })
              }}
            />
            {imagePreviewUrl && (
              <Card withBorder padding="xs" radius="md">
                <Group gap="xs" align="flex-start">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                    onClick={() => setImagePreviewModalOpen(true)}
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {imageFileName ?? 'Imagem selecionada'}
                    </Text>
                    <Button
                      size="xs"
                      status="danger"
                      variant="subtle"
                      leftSection={<Icon name="trash" size={14} />}
                      onClick={() => {
                        setImagePreviewUrl(null)
                        setImageBase64(null)
                        setImageContentType(null)
                        setImageFileName(null)
                      }}
                    >
                      Remover
                    </Button>
                  </Stack>
                </Group>
              </Card>
            )}
          </Stack>
        </Stack>
      </AppModal>
      <Modal
        opened={imagePreviewModalOpen}
        onClose={() => setImagePreviewModalOpen(false)}
        title="Preview da imagem"
        size="lg"
        centered
      >
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
          />
        )}
      </Modal>
    </Stack>
  )
}

function ProdutosTab({ companyId }: { companyId: string }) {
  const { data: products = [], isLoading } = useProducts(companyId)
  const { data: primaryProducts = [] } = usePrimaryProducts(companyId)
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [primaryProductId, setPrimaryProductId] = useState<string>('')
  const [price, setPrice] = useState<number | ''>('')
  const [sellUnit, setSellUnit] = useState('')
  const [isFractional, setIsFractional] = useState(false)
  const [customExpirationDate, setCustomExpirationDate] = useState<string>('')
  const [active, setActive] = useState(true)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageContentType, setImageContentType] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string | null>(null)
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    primaryProductId?: string
    price?: string
    sellUnit?: string
  }>({})

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setPrimaryProductId(primaryProducts[0]?.id ?? '')
    setPrice('')
    setSellUnit('')
    setIsFractional(false)
    setCustomExpirationDate('')
    setActive(true)
    setImagePreviewUrl(null)
    setImageBase64(null)
    setImageContentType(null)
    setImageFileName(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setFieldErrors({})
    setErrorMessage(null)
    setPrimaryProductId(primaryProducts[0]?.id ?? '')
    setSellUnit(primaryProducts[0]?.unit ?? '')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: Product) => {
    setEditingId(item.id)
    setName(item.name ?? '')
    setPrimaryProductId(item.primaryProductId ?? '')
    setPrice(item.price ?? '')
    setSellUnit(item.sellUnit ?? '')
    setIsFractional(item.isFractional ?? false)
    setCustomExpirationDate(item.customExpirationDate?.slice(0, 10) ?? '')
    setActive(item.active ?? true)
    setImagePreviewUrl(item.imageUrl ?? null)
    setImageBase64(null)
    setImageContentType(null)
    setImageFileName(null)
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
    const nameTrim = name.trim()
    const errors: typeof fieldErrors = {}
    if (!nameTrim) errors.name = 'Preencha o nome'
    if (!primaryProductId) errors.primaryProductId = 'Selecione o insumo'
    const priceNum = price === '' ? NaN : Number(price)
    if (isNaN(priceNum) || priceNum <= 0) errors.price = 'Preço deve ser maior que zero'
    if (!sellUnit.trim()) errors.sellUnit = 'Informe a unidade de venda'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setErrorMessage(null)

    const baseDto: CreateProductDto = {
      companyId,
      primaryProductId,
      name: nameTrim,
      price: priceNum,
      sellUnit: sellUnit.trim(),
      isFractional: isFractional,
      customExpirationDate: customExpirationDate ? customExpirationDate : null,
      active,
      ...(imageBase64 ? { image: imageBase64, imageContentType: imageContentType ?? undefined } : {}),
    }

    if (editingId) {
      const updateDto: UpdateProductDto = {
        primaryProductId,
        name: nameTrim,
        price: priceNum,
        sellUnit: sellUnit.trim(),
        isFractional,
        customExpirationDate: customExpirationDate || null,
        active,
        ...(imageBase64 ? { image: imageBase64, imageContentType: imageContentType ?? undefined } : {}),
      }
      updateProductMutation.mutate(
        { id: editingId, dto: updateDto },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => {
            setErrorMessage(null)
            setIsModalOpen(false)
          },
        }
      )
    } else {
      createProductMutation.mutate(baseDto, {
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
    deleteProductMutation.mutate(id, {
      onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
    })
  }

  return (
    <Stack gap="sm">
      <Text c="dimmed" size="sm">
        Produtos do cardápio: itens que o cliente compra. Cada produto está vinculado a um insumo.
      </Text>
      {primaryProducts.length === 0 && (
        <Text c="orange" size="sm">
          Cadastre insumos na aba Insumos antes de criar produtos.
        </Text>
      )}
      <Group>
        <Button
          size="xs"
          status="default"
          leftSection={<Icon name="plus" size={16} />}
          onClick={handleOpenNew}
          disabled={primaryProducts.length === 0}
        >
          Novo produto
        </Button>
      </Group>

      {errorMessage && <AppError message={errorMessage} />}

      {isLoading && <AppLoader />}

      {!isLoading && products.length === 0 && (
        <Text c="dimmed">
          Nenhum produto cadastrado. Crie produtos para montar o cardápio.
        </Text>
      )}

      {!isLoading && products.length > 0 && (
        <Card>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Insumo</Table.Th>
                <Table.Th>Preço</Table.Th>
                <Table.Th>Unidade venda</Table.Th>
                <Table.Th>Data entrada</Table.Th>
                <Table.Th>Armazenamento</Table.Th>
                <Table.Th>Validade (dias)</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ width: 240, whiteSpace: 'nowrap' }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item.primaryProductName ?? item.primaryProductId}</Table.Td>
                  <Table.Td>
                    {typeof item.price === 'number'
                      ? item.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      : item.price}
                  </Table.Td>
                  <Table.Td>{item.sellUnit}</Table.Td>
                  <Table.Td>
                    {item.primaryProductStockEntryDate
                      ? new Date(item.primaryProductStockEntryDate).toLocaleDateString('pt-BR')
                      : '—'}
                  </Table.Td>
                  <Table.Td>
                    {item.primaryProductStorageType
                      ? STORAGE_TYPE_LABELS[item.primaryProductStorageType] ?? item.primaryProductStorageType
                      : '—'}
                  </Table.Td>
                  <Table.Td>{item.primaryProductMaxStorageDays ?? '—'}</Table.Td>
                  <Table.Td>{item.active ? 'Sim' : 'Não'}</Table.Td>
                  <Table.Td style={{ width: 240, whiteSpace: 'nowrap' }}>
                    <Group gap="xs" justify="center" wrap="nowrap">
                      {item.stockLow && <Badge color="yellow">Estoque baixo</Badge>}
                      {item.isExpired && <Badge color="red">Vencido</Badge>}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        status="warning"
                        leftSection={<Icon name="pencil" size={16} />}
                        onClick={() => handleOpenEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        status="danger"
                        leftSection={<Icon name="trash" size={16} />}
                        loading={deleteProductMutation.isPending}
                        onClick={() => handleDelete(item.id)}
                      >
                        Excluir
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      <AppModal
        opened={isModalOpen}
        title={editingId ? 'Editar produto' : 'Novo produto'}
        onClose={handleCloseModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmit}
        loading={
          createProductMutation.isPending || updateProductMutation.isPending
        }
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppSelect
            label="Insumo"
            data={primaryProducts.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.unit})`,
            }))}
            value={primaryProductId}
            onChange={(value) => {
              setPrimaryProductId(value ?? '')
              const p = primaryProducts.find((x) => x.id === value)
              if (p && !editingId) setSellUnit(p.unit ?? '')
            }}
            error={fieldErrors.primaryProductId}
          />
          <AppInput
            label="Nome do produto"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={fieldErrors.name}
          />
          <AppNumberInput
            label="Preço (R$)"
            min={0}
            value={price}
            onChange={(v) => {
              setPrice(v)
              if (fieldErrors.price) setFieldErrors((prev) => ({ ...prev, price: undefined }))
            }}
            error={fieldErrors.price}
          />
          <AppInput
            label="Unidade de venda"
            value={sellUnit}
            onChange={(event) => {
              setSellUnit(event.currentTarget.value)
              if (fieldErrors.sellUnit) setFieldErrors((prev) => ({ ...prev, sellUnit: undefined }))
            }}
            error={fieldErrors.sellUnit}
          />
          <AppInput
            label="Data validade própria (opcional)"
            type="date"
            value={customExpirationDate}
            onChange={(event) => setCustomExpirationDate(event.currentTarget.value)}
          />
          <AppCheckbox
            label="Venda fracionada"
            checked={isFractional}
            onChange={(event) => setIsFractional(event.currentTarget.checked)}
          />
          <AppCheckbox
            label="Ativo"
            checked={active}
            onChange={(event) => setActive(event.currentTarget.checked)}
          />
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              Imagem (opcional)
            </Text>
            <Button
              size="xs"
              status="secondary"
              variant="light"
              leftSection={<Icon name="plus" size={14} />}
              onClick={() => {
                document.getElementById('produto-image-input')?.click()
              }}
            >
              {imageFileName ?? 'Selecionar imagem'}
            </Button>
            <input
              id="produto-image-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImageFileName(file.name)
                readFileAsBase64(file).then(({ base64, contentType }) => {
                  setImageBase64(base64)
                  setImageContentType(contentType)
                  setImagePreviewUrl(`data:${contentType};base64,${base64}`)
                })
              }}
            />
            {imagePreviewUrl && (
              <Card withBorder padding="xs" radius="md">
                <Group gap="xs" align="flex-start">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                    onClick={() => setImagePreviewModalOpen(true)}
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {imageFileName ?? 'Imagem selecionada'}
                    </Text>
                    <Button
                      size="xs"
                      status="danger"
                      variant="subtle"
                      leftSection={<Icon name="trash" size={14} />}
                      onClick={() => {
                        setImagePreviewUrl(null)
                        setImageBase64(null)
                        setImageContentType(null)
                        setImageFileName(null)
                      }}
                    >
                      Remover
                    </Button>
                  </Stack>
                </Group>
              </Card>
            )}
          </Stack>
        </Stack>
      </AppModal>
      <Modal
        opened={imagePreviewModalOpen}
        onClose={() => setImagePreviewModalOpen(false)}
        title="Preview da imagem"
        size="lg"
        centered
      >
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
          />
        )}
      </Modal>
    </Stack>
  )
}

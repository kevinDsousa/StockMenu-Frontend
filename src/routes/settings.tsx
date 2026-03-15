import { createFileRoute } from '@tanstack/react-router'
import {
  AppError,
  AppInput,
  AppLoader,
  AppModal,
  AppNumberInput,
  AppSwitch,
  Button,
  Card,
  Icon,
  PageContainer,
} from '@/components'
import { Badge, Group, Stack, Table, Tabs, Text, useMantineTheme } from '@mantine/core'
import {
  useCreateUnitMeasure,
  useDeleteUnitMeasure,
  useUnitMeasuresList,
  useUpdateUnitMeasure,
  usePaymentMethodsList,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  useCompany,
  useUpdateCompany,
} from '@/hooks'
import { extractApiErrorMessage } from '@/utils/api-error'
import { ConfirmDeleteModal } from '@/components/ui/DefaultModal/ConfirmDeleteModal'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { getCompanyIdForData, getNoCompanyMessage } from '@/utils/permissions'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const theme = useMantineTheme()
  const primaryColor = theme.colors[theme.primaryColor]?.[6] ?? theme.colors.blue[6]

  return (
    <PageContainer title="Configurações">
      <Tabs defaultValue="units">
        <Tabs.List mb="md">
          <Tabs.Tab value="units" leftSection={<Icon name="ruler" size={18} color={primaryColor} />}>
            Unidades
          </Tabs.Tab>
          <Tabs.Tab value="stock" leftSection={<Icon name="package" size={18} color={primaryColor} />}>
            Estoque
          </Tabs.Tab>
          <Tabs.Tab value="menu" leftSection={<Icon name="menu" size={18} color={primaryColor} />}>
            Cardápio
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<Icon name="currency" size={18} color={primaryColor} />}>
            Pagamentos
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="units">
          <UnitsTab />
        </Tabs.Panel>

        <Tabs.Panel value="stock">
          <StockConfigTab />
        </Tabs.Panel>

        <Tabs.Panel value="menu">
          <Text c="dimmed" size="sm">
            Configurações de categorias de cardápio e produtos serão definidas
            aqui.
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          <PaymentsTab />
        </Tabs.Panel>
      </Tabs>
    </PageContainer>
  )
}

function StockConfigTab() {
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const { data: company, isLoading } = useCompany(companyId ?? undefined)
  const updateCompanyMutation = useUpdateCompany()
  const [days, setDays] = useState<number | ''>(7)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (company?.stockExpiringDays != null) {
      setDays(company.stockExpiringDays)
    }
  }, [company?.stockExpiringDays])

  if (!companyId) {
    return (
      <Card>
        <Text c="dimmed" size="sm">
          {getNoCompanyMessage()}
        </Text>
      </Card>
    )
  }

  const handleSave = () => {
    const value = days === '' ? 7 : Number(days)
    if (value < 1) return
    if (!company) return
    setErrorMessage(null)
    updateCompanyMutation.mutate(
      {
        id: companyId,
        dto: {
          tradeName: company.tradeName,
          corporateName: company.corporateName ?? undefined,
          cnpj: company.cnpj,
          whatsapp: company.whatsapp ?? undefined,
          maxWaiters: company.maxWaiters ?? undefined,
          stockExpiringDays: value,
        },
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => setErrorMessage(null),
      }
    )
  }

  if (isLoading) return <AppLoader />
  const currentDays = company?.stockExpiringDays ?? 7

  return (
    <Stack gap="md">
      <Text c="dimmed" size="sm">
        Número de dias antes do vencimento para marcar o produto como &quot;Vencendo&quot; na tela de estoque.
      </Text>
      {errorMessage && <AppError message={errorMessage} />}
      <Card>
        <Stack gap="sm">
          <AppNumberInput
            label="Dias para considerar produto vencendo"
            min={1}
            value={days === '' && company ? currentDays : days}
            onChange={(v) => setDays(v === '' ? '' : Number(v))}
          />
          <Group>
            <Button
              size="xs"
              status="default"
              leftSection={<Icon name="pencil" size={16} />}
              loading={updateCompanyMutation.isPending}
              onClick={handleSave}
            >
              Salvar
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}

function UnitsTab() {
  const { data: list = [], isLoading, error } = useUnitMeasuresList()
  const createMutation = useCreateUnitMeasure()
  const updateMutation = useUpdateUnitMeasure()
  const deleteMutation = useDeleteUnitMeasure()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingLabel, setDeletingLabel] = useState<string | null>(null)
  const [key, setKey] = useState('')
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ key?: string; label?: string }>({})

  const unitMeasures = Array.isArray(list) ? list : []

  const openNew = () => {
    setEditingId(null)
    setKey('')
    setLabel('')
    setActive(true)
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (u: { id: string; key: string; label: string; active: boolean }) => {
    setEditingId(u.id)
    setKey(u.key)
    setLabel(u.label)
    setActive(u.active)
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(false)
  }

  const handleSubmit = () => {
    const keyTrim = key.trim().toUpperCase()
    const labelTrim = label.trim()
    const errors: { key?: string; label?: string } = {}
    if (!keyTrim) errors.key = 'Preencha o código'
    if (!labelTrim) errors.label = 'Preencha a descrição'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setErrorMessage(null)

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, dto: { key: keyTrim, label: labelTrim, active } },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => closeModal(),
        }
      )
    } else {
      createMutation.mutate(
        { key: keyTrim, label: labelTrim, active },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => closeModal(),
        }
      )
    }
  }

  const openDelete = (u: { id: string; label: string }) => {
    setDeletingId(u.id)
    setDeletingLabel(u.label)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeletingId(null)
    setDeletingLabel(null)
    setDeleteModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!deletingId) return
    setErrorMessage(null)
    deleteMutation.mutate(deletingId, {
      onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
      onSuccess: () => {
        closeDeleteModal()
      },
    })
  }

  return (
    <Stack gap="md">
      <Text c="dimmed">
        Cadastre e edite as unidades de medida usadas em insumos e produtos.
      </Text>

      <Group>
        <Button
          size="xs"
          status="default"
          leftSection={<Icon name="plus" size={16} />}
          onClick={openNew}
        >
          Nova unidade
        </Button>
      </Group>

      {errorMessage && <AppError message={errorMessage} />}

      {isLoading && <AppLoader />}
      {error && <AppError message="Erro ao carregar unidades de medida." />}

      {!isLoading && !error && (
        <Card>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Código</Table.Th>
                <Table.Th>Descrição</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th style={{ width: 220, whiteSpace: 'nowrap' }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {unitMeasures.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed" size="sm">
                      Nenhuma unidade configurada. Clique em Nova unidade para
                      cadastrar.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
              {unitMeasures.map((u) => (
                <Table.Tr key={u.id}>
                  <Table.Td>
                    <Text fw={500}>{u.key}</Text>
                  </Table.Td>
                  <Table.Td>{u.label}</Table.Td>
                  <Table.Td>
                    <Badge color={u.active ? 'green' : 'gray'}>
                      {u.active ? 'Sim' : 'Não'}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ width: 220, whiteSpace: 'nowrap' }}>
                    <Group gap="xs" justify="center" wrap="nowrap">
                      <Button
                        size="xs"
                        status="warning"
                        leftSection={<Icon name="pencil" size={16} />}
                        onClick={() => openEdit(u)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        status="danger"
                        leftSection={<Icon name="trash" size={16} />}
                        loading={deleteMutation.isPending}
                        onClick={() => openDelete(u)}
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
        opened={modalOpen}
        title={editingId ? 'Editar unidade' : 'Nova unidade'}
        onClose={closeModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppInput
            label="Código"
            value={key}
            onChange={(e) => {
              setKey(e.currentTarget.value)
              if (fieldErrors.key) setFieldErrors((prev) => ({ ...prev, key: undefined }))
            }}
            placeholder="Ex: KG, UN, L"
            disabled={!!editingId}
            error={fieldErrors.key}
          />
          <AppInput
            label="Descrição"
            value={label}
            onChange={(e) => {
              setLabel(e.currentTarget.value)
              if (fieldErrors.label) setFieldErrors((prev) => ({ ...prev, label: undefined }))
            }}
            placeholder="Ex: Quilograma, Unidade"
            error={fieldErrors.label}
          />
          <AppSwitch
            label="Ativo"
            checked={active}
            onChange={(e) => setActive(e.currentTarget.checked)}
          />
        </Stack>
      </AppModal>

      <ConfirmDeleteModal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        itemLabel={deletingLabel ?? undefined}
        loading={deleteMutation.isPending}
      />
    </Stack>
  )
}

function PaymentsTab() {
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = !companyId

  const { data: list = [], isLoading, error } = usePaymentMethodsList(companyId)
  const createMutation = useCreatePaymentMethod()
  const updateMutation = useUpdatePaymentMethod()
  const deleteMutation = useDeletePaymentMethod()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingLabel, setDeletingLabel] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [allowsDelivery, setAllowsDelivery] = useState(true)
  const [onlinePayment, setOnlinePayment] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({})

  const paymentMethods = Array.isArray(list) ? list : []

  if (needsCompany) {
    return (
      <Card>
        <Text c="dimmed" size="sm">
          {getNoCompanyMessage()}
        </Text>
      </Card>
    )
  }

  const openNew = () => {
    setEditingId(null)
    setName('')
    setActive(true)
    setAllowsDelivery(true)
    setOnlinePayment(false)
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (p: { id: string; name: string; active: boolean; allowsDelivery: boolean; onlinePayment: boolean }) => {
    setEditingId(p.id)
    setName(p.name)
    setActive(p.active)
    setAllowsDelivery(p.allowsDelivery)
    setOnlinePayment(p.onlinePayment)
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setErrorMessage(null)
    setFieldErrors({})
    setModalOpen(false)
  }

  const handleSubmit = () => {
    const nameTrim = name.trim()
    const errors: { name?: string } = {}
    if (!nameTrim) errors.name = 'Preencha o nome'
    if (nameTrim.length < 2) errors.name = 'Nome deve ter pelo menos 2 caracteres'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setErrorMessage(null)

    if (editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          dto: {
            companyId,
            name: nameTrim,
            active,
            allowsDelivery,
            onlinePayment,
          },
        },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => closeModal(),
        }
      )
    } else {
      createMutation.mutate(
        {
          companyId,
          name: nameTrim,
          active,
          allowsDelivery,
          onlinePayment,
        },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => closeModal(),
        }
      )
    }
  }

  const openDelete = (p: { id: string; name: string }) => {
    setDeletingId(p.id)
    setDeletingLabel(p.name)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeletingId(null)
    setDeletingLabel(null)
    setDeleteModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!deletingId) return
    setErrorMessage(null)
    deleteMutation.mutate(deletingId, {
      onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
      onSuccess: () => closeDeleteModal(),
    })
  }

  return (
    <Stack gap="md">
      <Text c="dimmed">
        Cadastre as formas de pagamento disponíveis para a empresa (dinheiro, cartão, PIX, etc.).
      </Text>

      <Group>
        <Button
          size="xs"
          status="default"
          leftSection={<Icon name="plus" size={16} />}
          onClick={openNew}
        >
          Nova forma de pagamento
        </Button>
      </Group>

      {errorMessage && <AppError message={errorMessage} />}

      {isLoading && <AppLoader />}
      {error && <AppError message="Erro ao carregar formas de pagamento." />}

      {!isLoading && !error && (
        <Card>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Permite entrega</Table.Th>
                <Table.Th>Pagamento online</Table.Th>
                <Table.Th style={{ width: 240, whiteSpace: 'nowrap' }}>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paymentMethods.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text c="dimmed" size="sm">
                      Nenhuma forma de pagamento configurada. Clique em Nova forma de pagamento para cadastrar.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
              {paymentMethods.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text fw={500}>{p.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={p.active ? 'green' : 'gray'}>
                      {p.active ? 'Sim' : 'Não'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={p.allowsDelivery ? 'green' : 'gray'}>
                      {p.allowsDelivery ? 'Sim' : 'Não'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={p.onlinePayment ? 'blue' : 'gray'}>
                      {p.onlinePayment ? 'Sim' : 'Não'}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ width: 240, whiteSpace: 'nowrap' }}>
                    <Group gap="xs" justify="center" wrap="nowrap">
                      <Button
                        size="xs"
                        status="warning"
                        leftSection={<Icon name="pencil" size={16} />}
                        onClick={() => openEdit(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        status="danger"
                        leftSection={<Icon name="trash" size={16} />}
                        loading={deleteMutation.isPending}
                        onClick={() => openDelete(p)}
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
        opened={modalOpen}
        title={editingId ? 'Editar forma de pagamento' : 'Nova forma de pagamento'}
        onClose={closeModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <Stack gap="sm">
          {errorMessage && <AppError message={errorMessage} />}
          <AppInput
            label="Nome"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
            }}
            placeholder="Ex: Dinheiro, Cartão, PIX"
            error={fieldErrors.name}
          />
          <AppSwitch
            label="Ativo"
            checked={active}
            onChange={(e) => setActive(e.currentTarget.checked)}
          />
          <AppSwitch
            label="Permite entrega"
            checked={allowsDelivery}
            onChange={(e) => setAllowsDelivery(e.currentTarget.checked)}
          />
          <AppSwitch
            label="Pagamento online"
            checked={onlinePayment}
            onChange={(e) => setOnlinePayment(e.currentTarget.checked)}
          />
        </Stack>
      </AppModal>

      <ConfirmDeleteModal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        itemLabel={deletingLabel ?? undefined}
        loading={deleteMutation.isPending}
      />
    </Stack>
  )
}


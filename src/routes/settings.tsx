import { createFileRoute } from '@tanstack/react-router'
import {
  AppError,
  AppInput,
  AppLoader,
  AppModal,
  Button,
  Card,
  PageContainer,
} from '@/components'
import { Badge, Group, Stack, Switch, Table, Tabs, Text } from '@mantine/core'
import {
  useCreateUnitMeasure,
  useDeleteUnitMeasure,
  useUnitMeasuresList,
  useUpdateUnitMeasure,
} from '@/hooks'
import { extractApiErrorMessage } from '@/utils/api-error'
import { ConfirmDeleteModal } from '@/components/ui/DefaultModal/ConfirmDeleteModal'
import { useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <PageContainer title="Configurações">
      <Tabs defaultValue="units">
        <Tabs.List mb="md">
          <Tabs.Tab value="units">Unidades</Tabs.Tab>
          <Tabs.Tab value="stock">Estoque</Tabs.Tab>
          <Tabs.Tab value="menu">Cardápio</Tabs.Tab>
          <Tabs.Tab value="payments">Pagamentos</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="units">
          <UnitsTab />
        </Tabs.Panel>

        <Tabs.Panel value="stock">
          <Text c="dimmed" size="sm">
            Configurações de estoque (ex.: dias para considerar produto vencendo)
            serão definidas aqui.
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="menu">
          <Text c="dimmed" size="sm">
            Configurações de categorias de cardápio e produtos serão definidas
            aqui.
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          <Text c="dimmed" size="sm">
            Configurações de formas de pagamento serão definidas aqui.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </PageContainer>
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
        <Button size="xs" onClick={openNew}>
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
                <Table.Th>Ações</Table.Th>
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
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="xs" variant="light" onClick={() => openEdit(u)}>
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
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
          <Switch
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


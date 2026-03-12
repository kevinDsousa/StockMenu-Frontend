import { createFileRoute } from '@tanstack/react-router'
import { Badge, Group, Select, Stack, Switch, Table, Text } from '@mantine/core'
import { AppInput, AppLoader, AppModal, Button, PageContainer, AppError } from '@/components'
import { useUsers, useCreateUser, useUpdateUser } from '@/hooks'
import { useAuthStore } from '@/store/auth'
import { useState } from 'react'
import { extractApiErrorMessage } from '@/utils/api-error'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const user = useAuthStore((state) => state.user)
  const companyId = user?.companyId ?? null
  const userRole = user?.role

  if (userRole !== 'COMPANY_ADMIN') {
    return (
      <PageContainer title="Usuários da empresa">
        <Stack gap="sm">
          <Text c="dimmed" size="sm">
            Você não tem permissão para acessar esta área.
          </Text>
        </Stack>
      </PageContainer>
    )
  }

  const { data, isLoading } = useUsers(companyId)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'WAITER' | 'COMPANY_ADMIN'>('WAITER')
  const [active, setActive] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  const users = Array.isArray(data) ? data : (data as any)?.data ?? []

  const resetForm = () => {
    setEditingUserId(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('WAITER')
    setActive(true)
  }

  const handleOpenNewUserModal = () => {
    resetForm()
    setFieldErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEditUserModal = (u: any) => {
    setEditingUserId(u.id)
    setName(u.name ?? '')
    setEmail(u.email ?? '')
    setPassword('')
    setRole(u.role === 'COMPANY_ADMIN' ? 'COMPANY_ADMIN' : 'WAITER')
    setActive(!!u.active)
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
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) errors.name = 'Preencha o nome'
    if (!email.trim()) errors.email = 'Preencha o e-mail'
    if (!editingUserId && !password.trim()) errors.password = 'Preencha a senha'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setErrorMessage(null)

    if (editingUserId) {
      const dto: any = {
        name,
        email,
        role,
        active,
      }
      if (password) {
        dto.password = password
      }
      updateUserMutation.mutate(
        { id: editingUserId, dto },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => {
            setErrorMessage(null)
            setIsModalOpen(false)
          },
        }
      )
    } else {
      createUserMutation.mutate(
        {
          companyId,
          name,
          email,
          password,
          role,
          active,
        },
        {
          onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
          onSuccess: () => {
            setErrorMessage(null)
            setIsModalOpen(false)
          },
        }
      )
    }
  }

  return (
    <PageContainer title="Usuários da empresa">
      <Stack gap="sm" mb="md">
        <Text c="dimmed">
          Gestão de usuários (garçons e administradores) da empresa logada.
        </Text>
        <Group justify="flex-start">
          <Button size="xs" onClick={handleOpenNewUserModal}>
            Novo usuário
          </Button>
        </Group>
      </Stack>

      {isLoading && <AppLoader />}

      {!isLoading && (!users || users.length === 0) && (
        <Text c="dimmed">Nenhum usuário cadastrado para esta empresa.</Text>
      )}

      {!isLoading && users && users.length > 0 && (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Perfil</Table.Th>
              <Table.Th>Ativo</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((u: any) => (
              <Table.Tr key={u.id}>
                <Table.Td>{u.name}</Table.Td>
                <Table.Td>{u.email}</Table.Td>
                <Table.Td>
                  <Badge color={u.role === 'WAITER' ? 'blue' : 'grape'}>
                    {u.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={u.active ? 'green' : 'red'}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleOpenEditUserModal(u)}
                  >
                    Editar
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <AppModal
        opened={isModalOpen}
        title={editingUserId ? 'Editar usuário' : 'Novo usuário'}
        onClose={handleCloseModal}
        confirmLabel="Salvar"
        onConfirm={handleSubmit}
        loading={createUserMutation.isPending || updateUserMutation.isPending}
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
          <AppInput
            label="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
            }}
            error={fieldErrors.email}
          />
          {!editingUserId && (
            <AppInput
              label="Senha"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
              }}
              error={fieldErrors.password}
            />
          )}
          {editingUserId && (
            <AppInput
              label="Nova senha (opcional)"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          )}
          <Select
            label="Perfil"
            data={[
              { value: 'WAITER', label: 'Garçom' },
              { value: 'COMPANY_ADMIN', label: 'Administrador da empresa' },
            ]}
            value={role}
            onChange={(value) => setRole((value as 'WAITER' | 'COMPANY_ADMIN') ?? 'WAITER')}
          />
          <Switch
            label="Ativo"
            checked={active}
            onChange={(event) => setActive(event.currentTarget.checked)}
          />
        </Stack>
      </AppModal>
    </PageContainer>
  )
}


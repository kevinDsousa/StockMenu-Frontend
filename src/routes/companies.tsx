import { createFileRoute } from '@tanstack/react-router'
import { Badge, Group, NumberInput, Stack, Table, Text } from '@mantine/core'
import { AppLoader, PageContainer, Card, Button, AppError } from '@/components'
import { useCompanies, useUpdateCompany } from '@/hooks'
import { useAuthStore } from '@/store/auth'
import { useState } from 'react'
import { extractApiErrorMessage } from '@/utils/api-error'

export const Route = createFileRoute('/companies')({
  component: CompaniesComponent,
})

function CompaniesComponent() {
  const user = useAuthStore((state) => state.user)
  const role = user?.role

  if (role !== 'SUPER_ADMIN') {
    return (
      <PageContainer title="Gestão de Empresas">
        <Card>
          <Text c="dimmed" size="sm">
            Você não tem permissão para acessar esta área.
          </Text>
        </Card>
      </PageContainer>
    )
  }

  const { data, isLoading } = useCompanies()
  const updateCompanyMutation = useUpdateCompany()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const companies = Array.isArray(data) ? data : (data as any)?.data ?? []

  const handleChangeMaxWaiters = (companyId: string, value: number | '') => {
    if (value === '' || value < 0) return
    setErrorMessage(null)
    updateCompanyMutation.mutate(
      {
        id: companyId,
        dto: { maxWaiters: value },
      },
      {
        onError: (err) => setErrorMessage(extractApiErrorMessage(err)),
        onSuccess: () => setErrorMessage(null),
      }
    )
  }

  return (
    <PageContainer title="Gestão de Empresas">
      <Card>
        {errorMessage && (
          <Stack gap="sm" mb="md">
            <AppError message={errorMessage} />
          </Stack>
        )}
        {isLoading && <AppLoader />}

        {!isLoading && (!companies || companies.length === 0) && (
          <Text c="dimmed">Nenhuma empresa cadastrada.</Text>
        )}

        {!isLoading && companies && companies.length > 0 && (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome fantasia</Table.Th>
                <Table.Th>CNPJ</Table.Th>
                <Table.Th>WhatsApp</Table.Th>
                <Table.Th>Ativa</Table.Th>
                <Table.Th>Pode operar</Table.Th>
                <Table.Th>Limite de garçons (maxWaiters)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {companies.map((company: any) => (
                <Table.Tr key={company.id}>
                  <Table.Td>
                    <Text fw={500}>{company.tradeName}</Text>
                    {company.corporateName && (
                      <Text size="xs" c="dimmed">
                        {company.corporateName}
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>{company.cnpj}</Table.Td>
                  <Table.Td>{company.whatsapp ?? '—'}</Table.Td>
                  <Table.Td>
                    <Badge color={company.active ? 'green' : 'red'}>
                      {company.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={company.canOperate ? 'green' : 'red'}>
                      {company.canOperate ? 'Pode operar' : 'Bloqueada'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <NumberInput
                        size="xs"
                        min={0}
                        value={company.maxWaiters ?? 0}
                        onChange={(value) => handleChangeMaxWaiters(company.id, value === '' ? '' : Number(value))}
                      />
                      <Button
                        size="xs"
                        variant="light"
                        loading={updateCompanyMutation.isPending}
                        onClick={() =>
                          handleChangeMaxWaiters(
                            company.id,
                            company.maxWaiters ?? 0
                          )
                        }
                      >
                        Salvar
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  )
}
import { createFileRoute } from '@tanstack/react-router'
import { Card, Stack, Table, Text } from '@mantine/core'
import { PageContainer, AppLoader } from '@/components'
import { usePaymentHistory } from '@/hooks'
import { useAuthStore } from '@/store/auth'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'
import dayjs from 'dayjs'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = mustUseOwnCompany(user?.role) && !companyId
  const { data: history = [], isLoading } = usePaymentHistory(needsCompany ? undefined : companyId ?? undefined)

  if (needsCompany) {
    return (
      <PageContainer title="Histórico de pagamentos">
        <Card>
          <Text c="dimmed" size="sm">
            {getNoCompanyMessage()}
          </Text>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Histórico de pagamentos">
      {isLoading && <AppLoader />}
      <Stack gap="sm">
        {!isLoading && history.length === 0 && (
          <Card>
            <Text c="dimmed" size="sm">
              Nenhum pagamento registrado ainda.
            </Text>
          </Card>
        )}
        {!isLoading && history.length > 0 && (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Mesa</Table.Th>
                <Table.Th>Valor pago</Table.Th>
                <Table.Th>Fechado em</Table.Th>
                <Table.Th>Garçom</Table.Th>
                <Table.Th>Forma de pagamento</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {history.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      Mesa {row.tableNumber}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">R$ {row.totalAmount.toFixed(2)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {dayjs(row.closedAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{row.closedByUserName ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{row.paymentMethodName ?? '—'}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </PageContainer>
  )
}

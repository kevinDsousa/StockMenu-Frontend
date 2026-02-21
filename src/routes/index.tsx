import { createFileRoute } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { PageContainer } from '@/components'

export const Route = createFileRoute('/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <PageContainer title="Dashboard">
      <Text c="dimmed">Visão geral do sistema. Em breve: resumo de pedidos e mesas.</Text>
    </PageContainer>
  )
}

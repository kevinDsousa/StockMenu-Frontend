import { createFileRoute } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { PageContainer, Card } from '@/components'

export const Route = createFileRoute('/companies')({
  component: CompaniesComponent,
})

function CompaniesComponent() {
  return (
    <PageContainer title="Gestão de Empresas">
      <Card>
        <Text>Em breve: Listagem de empresas consumindo o backend Java.</Text>
      </Card>
    </PageContainer>
  )
}
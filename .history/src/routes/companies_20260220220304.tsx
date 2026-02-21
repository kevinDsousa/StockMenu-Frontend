import { createFileRoute } from '@tanstack/react-router'
import { Title, Text, Card } from '@mantine/core'

export const Route = createFileRoute('/companies')({
  component: CompaniesComponent,
})

function CompaniesComponent() {
  return (
    <div>
      <Title order={2} mb="lg">Gestão de Empresas</Title>
      <Card withBorder shadow="sm" radius="md">
        <Text>Em breve: Listagem de empresas consumindo o backend Java.</Text>
      </Card>
    </div>
  )
}
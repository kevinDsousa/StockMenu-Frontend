import { createFileRoute } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { PageContainer, Card } from '@/components'

export const Route = createFileRoute('/inventory')({
  component: InventoryComponent,
})

function InventoryComponent() {
  return (
    <PageContainer title="Estoque">
      <Card>
        <Text>Gestão de insumos (primary_products). Em breve: listagem e controle de estoque.</Text>
      </Card>
    </PageContainer>
  )
}

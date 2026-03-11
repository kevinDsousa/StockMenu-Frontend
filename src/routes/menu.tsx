import { createFileRoute } from '@tanstack/react-router'
import { Avatar, Badge, Card as MantineCard, Group, Loader, Stack, Text } from '@mantine/core'
import { PageContainer } from '@/components'
import { useAuthStore } from '@/store/auth'
import { usePrimaryProducts } from '@/hooks'
import { TABLE_OPEN_PASTEL, TABLE_REQUESTING_CLOSE_PASTEL } from '@/theme/colors'

export const Route = createFileRoute('/menu')({
  component: MenuPage,
})

function MenuPage() {
  const user = useAuthStore((state) => state.user)
  const { data: primaryProducts, isLoading } = usePrimaryProducts(user?.companyId ?? undefined)

  return (
    <PageContainer title="Cardápio">
      {isLoading && (
        <Group justify="center" my="lg">
          <Loader />
        </Group>
      )}

      {!isLoading && (!primaryProducts || primaryProducts.length === 0) && (
        <Text c="dimmed">Nenhum produto cadastrado para esta empresa.</Text>
      )}

      {!isLoading && primaryProducts && primaryProducts.length > 0 && (
        <Stack gap="sm">
          {primaryProducts.map((item) => {
            const lowStock = item.isStockLow
            const expired = item.isExpired
            const expiringSoon = item.isExpiringSoon

            return (
              <MantineCard
                key={item.id}
                withBorder
                radius="md"
                style={{
                  backgroundColor: expired
                    ? TABLE_REQUESTING_CLOSE_PASTEL
                    : TABLE_OPEN_PASTEL,
                }}
              >
                <Group align="flex-start" gap="md">
                  <Avatar
                    size={64}
                    radius="md"
                    src={item.imageUrl ?? undefined}
                    alt={item.name}
                  >
                    {item.name.charAt(0)}
                  </Avatar>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600}>{item.name}</Text>
                      <Group gap={4}>
                        {lowStock && <Badge color="yellow">Em baixa</Badge>}
                        {expired && <Badge color="red">Vencido</Badge>}
                        {!expired && expiringSoon && (
                          <Badge color="orange">Vencendo</Badge>
                        )}
                      </Group>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Estoque atual: {item.currentStock} {item.unit.toLowerCase()}
                    </Text>
                  </Stack>
                </Group>
              </MantineCard>
            )
          })}
        </Stack>
      )}
    </PageContainer>
  )
}


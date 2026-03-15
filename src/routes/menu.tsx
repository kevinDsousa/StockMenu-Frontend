import { createFileRoute } from '@tanstack/react-router'
import {
  Avatar,
  Badge,
  Card as MantineCard,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Card } from '@/components'
import { AppLoader, PageContainer } from '@/components'
import { useAuthStore } from '@/store/auth'
import { useProducts } from '@/hooks'
import type { Product } from '@/entities'
import { TABLE_OPEN_PASTEL, TABLE_REQUESTING_CLOSE_PASTEL } from '@/theme/colors'
import { getCompanyIdForData, getNoCompanyMessage, mustUseOwnCompany } from '@/utils/permissions'

export const Route = createFileRoute('/menu')({
  component: MenuPage,
})

function MenuPage() {
  const user = useAuthStore((state) => state.user)
  const companyId = getCompanyIdForData(user)
  const needsCompany = mustUseOwnCompany(user?.role) && !companyId
  const { data, isLoading } = useProducts(needsCompany ? undefined : companyId)
  const products: Product[] = data ?? []

  if (needsCompany) {
    return (
      <PageContainer title="Cardápio">
        <Card>
          <Text c="dimmed" size="sm">
            {getNoCompanyMessage()}
          </Text>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Cardápio">
      {isLoading && <AppLoader />}

      {!isLoading && (
        <Group align="stretch" gap="lg">
          <MantineCard
            radius="lg"
            p="xl"
            style={{
              flex: 1,
              minHeight: 320,
              background:
                'linear-gradient(135deg, rgba(34,139,230,0.9), rgba(64,224,208,0.9))',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Stack justify="space-between" style={{ height: '100%' }}>
              <Stack gap="xs">
                <Title order={2} c="white">
                  Seu cardápio digital
                </Title>
                <Text size="sm" c="rgba(255,255,255,0.85)">
                  Visualize rapidamente os itens mais importantes do cardápio, com
                  alertas de estoque baixo e validade, em um layout otimizado para o salão.
                </Text>
              </Stack>

              <Stack gap="xs">
                <Text size="xs" c="rgba(255,255,255,0.75)" fw={500}>
                  Destaques rápidos
                </Text>
                <Group gap="xs">
                  <Badge color="yellow" variant="light">
                    Em baixa
                  </Badge>
                  <Badge color="red" variant="light">
                    Vencido
                  </Badge>
                  <Badge color="orange" variant="light">
                    Vencendo
                  </Badge>
                </Group>
                <Text size="xs" c="rgba(255,255,255,0.75)">
                  Use estes status para decidir o que priorizar nas vendas e reposições.
                </Text>
              </Stack>
            </Stack>
          </MantineCard>

          <MantineCard
            radius="lg"
            p="md"
            withBorder
            style={{
              flex: 1.2,
              maxHeight: 460,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Group justify="space-between" mb="sm">
              <Title order={4}>Itens do cardápio</Title>
              <Text size="xs" c="dimmed">
                {products.length} item(s)
              </Text>
            </Group>

            <ScrollArea style={{ flex: 1 }}>
              {products.length === 0 ? (
                <Group justify="center" my="xl">
                  <Text c="dimmed" size="sm">
                    Nenhum item de cardápio cadastrado. Cadastre produtos em Estoque → Produtos (cardápio).
                  </Text>
                </Group>
              ) : (
                <Stack gap="sm">
                  {products.filter((p) => p.active).map((item: Product) => {
                    const lowStock = item.stockLow
                    const expired = item.isExpired

                    return (
                      <MantineCard
                        key={item.id}
                        withBorder
                        radius="md"
                        shadow="xs"
                        style={{
                          backgroundColor: expired
                            ? TABLE_REQUESTING_CLOSE_PASTEL
                            : TABLE_OPEN_PASTEL,
                          transition: 'transform 120ms ease, box-shadow 120ms ease',
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.transform = 'translateY(-2px)'
                          event.currentTarget.style.boxShadow =
                            '0 8px 18px rgba(0,0,0,0.12)'
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform = 'none'
                          event.currentTarget.style.boxShadow = 'none'
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
                            <Group justify="space-between" align="flex-start">
                              <Stack gap={2} style={{ flex: 1 }}>
                                <Text fw={600}>{item.name}</Text>
                                <Text size="xs" c="dimmed">
                                  {typeof item.price === 'number'
                                    ? item.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                      })
                                    : item.price}{' '}
                                  · {item.sellUnit}
                                </Text>
                              </Stack>
                              <Group gap={4}>
                                {lowStock && <Badge color="yellow">Estoque baixo</Badge>}
                                {expired && <Badge color="red">Vencido</Badge>}
                              </Group>
                            </Group>
                          </Stack>
                        </Group>
                      </MantineCard>
                    )
                  })}
                </Stack>
              )}
            </ScrollArea>
          </MantineCard>
        </Group>
      )}
    </PageContainer>
  )
}


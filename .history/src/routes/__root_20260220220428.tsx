import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { AppShell, Burger, Group, NavLink, Title, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2, IconBuildingSkyscraper, IconPackage } from '@tabler/icons-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3} c="blue">StockMenu</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" fw={700} c="dimmed" mb="xs" tt="uppercase">
          Menu Principal
        </Text>
        
        {/* Link para a Home */}
        <NavLink
          component={Link}
          to="/"
          label="Dashboard"
          leftSection={<IconHome2 size={20} stroke={1.5} />}
        />

        {/* Link para Empresas */}
        <NavLink
          component={Link}
          to="/companies"
          label="Empresas"
          leftSection={<IconBuildingSkyscraper size={20} stroke={1.5} />}
        />

        {/* Link para Estoque (Exemplo de futura feature) */}
        <NavLink
          component={Link}
          to="/inventory"
          label="Estoque"
          leftSection={<IconPackage size={20} stroke={1.5} />}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* O Outlet é onde as páginas específicas (Home, Companies, etc) serão renderizadas */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
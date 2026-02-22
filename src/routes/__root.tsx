import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { AppShell, Burger, Group, NavLink, Title, Text, ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Icon } from '@/components/icons'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

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
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} c="blue">StockMenu</Title>
          </Group>
          <Tooltip label={colorScheme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
            <ActionIcon
              variant="subtle"
              size="lg"
              aria-label={colorScheme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
              onClick={() => toggleColorScheme()}
            >
              <Icon name={colorScheme === 'dark' ? 'sun' : 'moon'} size={22} />
            </ActionIcon>
          </Tooltip>
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
          leftSection={<Icon name="home" size={20} />}
        />

        {/* Link para Empresas */}
        <NavLink
          component={Link}
          to="/companies"
          label="Empresas"
          leftSection={<Icon name="building" size={20} />}
        />

        {/* Link para Estoque (Exemplo de futura feature) */}
        <NavLink
          component={Link}
          to="/inventory"
          label="Estoque"
          leftSection={<Icon name="package" size={20} />}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* O Outlet é onde as páginas específicas (Home, Companies, etc) serão renderizadas */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
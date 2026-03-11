import { createFileRoute } from '@tanstack/react-router'
import { Group, Loader, Text } from '@mantine/core'
import { PageContainer } from '@/components'
import { VenueTables } from '@/components/widget/VenueTables/VenueTables'
import { SiderVenueTables } from '@/components/widget/SiderVenueTables/SiderVenueTables'
import { useState } from 'react'
import { useVenueTables } from '@/hooks'
import { useAuthStore } from '@/store/auth'

export const Route = createFileRoute('/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const user = useAuthStore((state) => state.user)
  const { data: tables, isLoading } = useVenueTables(user?.companyId ?? undefined)

  const tableList = Array.isArray(tables)
    ? tables
    : (tables as any)?.data ?? []

  const handleOpenSidebar = (tableId: string) => {
    setSelectedTableId(tableId)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setSelectedTableId(null)
  }

  return (
    <PageContainer title="Dashboard">
      <Text c="dimmed" mb="md">
        Visão geral de mesas da empresa.
      </Text>

      {isLoading && (
        <Group justify="center" my="lg">
          <Loader />
        </Group>
      )}

      {!isLoading && (!tableList || tableList.length === 0) && (
        <Text c="dimmed">Nenhuma mesa cadastrada para esta empresa.</Text>
      )}

      {!isLoading && tableList && tableList.length > 0 && (
        <Group gap="sm">
          {tableList.map((table: any) => (
            <VenueTables
              key={table.id}
              statusTable={table.status === 'FREE' ? 'open' : 'requesting_close'}
              tableNumber={table.tableNumber}
              onClick={() => handleOpenSidebar(table.id)}
            />
          ))}
        </Group>
      )}

      <SiderVenueTables
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        tableId={selectedTableId}
      />
    </PageContainer>
  )
}

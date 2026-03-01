import { createFileRoute } from '@tanstack/react-router'
import { Text } from '@mantine/core'
import { PageContainer } from '@/components'
import { VenueTables } from '@/components/widget/VenueTables/VenueTables'
import { SiderVenueTables } from '@/components/widget/SiderVenueTables/SiderVenueTables'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <PageContainer title="Dashboard">
      <Text c="dimmed">Visão geral do sistema. Em breve: resumo de pedidos e mesas.</Text>
      <VenueTables statusTable='requesting_close' tableNumber={10} onClick={handleOpenSidebar} />
      <VenueTables statusTable='open' tableNumber={10} />
      <SiderVenueTables isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </PageContainer>
  )
}

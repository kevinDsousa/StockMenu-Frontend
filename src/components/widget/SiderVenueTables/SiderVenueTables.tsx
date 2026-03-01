import { AppSideBar } from "@/components/ui/DefaultSideBar/AppSideBar"

interface SiderVenueTablesProps {
  isOpen: boolean
  onClose: () => void
}

export const SiderVenueTables = ({ isOpen, onClose }: SiderVenueTablesProps) => {
  return (
    <AppSideBar
      title="Mesas"
      position="right"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>Conteúdo da sidebar</div>
    </AppSideBar>
  )
}
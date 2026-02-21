export interface VenueTable {
  id: string
  companyId: string
  tableNumber: number
  capacity: number | null
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

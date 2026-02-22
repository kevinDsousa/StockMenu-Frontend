import { useMantineColorScheme } from '@mantine/core'
import { Button } from '../../ui'
import { statusVenueTableMap, useStyles } from '@/components/widget/VenueTables/__venue-table-config'
import type { TableProps } from '@/components/widget/VenueTables/__venue-table-config'

export const VenueTables = ({ tableName = 'Mesa', statusTable, tableNumber, onClick }: TableProps) => {

  const { colorScheme } = useMantineColorScheme()

  const statusConfig = statusVenueTableMap[statusTable]
  
  const classes = useStyles({ ...statusConfig, colorScheme })

  return (
    <Button
      size={statusConfig.size}
      radius={statusConfig.radius}
      onClick={onClick}
      className={classes.button}
    >
      {tableName} - {tableNumber ?? 'N'}
    </Button>
  )
}
import { useMantineColorScheme } from '@mantine/core'
import { Button } from '../../ui'
import { statusVenueTableMap, useStyles } from '@/components/widget/VenueTables/VenueTable.config'
import type { TableProps } from '@/components/widget/VenueTables/VenueTable.config'

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
      styles={{
        root: {
          padding: statusConfig.padding,
        },
      }}
    >
      {tableName} - {tableNumber ?? 'N'}
    </Button>
  )
}
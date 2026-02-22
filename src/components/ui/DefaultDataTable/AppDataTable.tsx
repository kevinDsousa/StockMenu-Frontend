import { Table, TableScrollContainer, LoadingOverlay, Box, Text } from '@mantine/core';
import type { DataTableProps } from './__data-table.config';
import type { ReactNode } from 'react';

export const DataTable = <T,>({ data, columns, isLoading = false, emptyMessage = 'Nenhum dado encontrado' }: DataTableProps<T>) => {
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
      <TableScrollContainer minWidth={500}>
        <Table verticalSpacing="sm" highlightOnHover striped="even">
          <Table.Thead>
            <Table.Tr>
              {columns.map((col, index) => (
                <Table.Th key={index} style={{ width: col.width }}>
                  {col.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <Table.Tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <Table.Td key={colIndex}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : (item[col.accessor] as ReactNode)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text ta="center" py="xl" c="dimmed">
                    {emptyMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </TableScrollContainer>
    </Box>
  );
};
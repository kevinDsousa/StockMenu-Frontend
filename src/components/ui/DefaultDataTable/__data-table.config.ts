import type { ReactNode } from 'react';

export interface ColumnConfig<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  width?: string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
}
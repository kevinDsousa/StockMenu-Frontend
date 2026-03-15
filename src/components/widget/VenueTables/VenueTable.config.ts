import { TABLE_OPEN_PASTEL, TABLE_REQUESTING_CLOSE_PASTEL, TABLE_REQUESTING_ORDER_PASTEL, TEXT_PRIMARY } from '@/theme';
import type { MantineColorScheme } from '@mantine/core';
import { createUseStyles } from 'react-jss';
import type { MouseEvent } from 'react';

// =============================================================================
// 1. TIPAGENS (Interfaces e Types)
// =============================================================================

export type TableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TableStatus = 'open' | 'requesting_order' | 'requesting_close';

/** Configuração de estilo para cada estado da mesa */
export interface StatusStyleConfig {
  backgroundColor: string;
  padding: string;
  size: TableSize;
  radius?: number | string;
  hoverOpacity?: number;
  transition: string;
}

/** Propriedades do componente de Mesa */
export interface TableProps {
  tableName?: string;
  statusTable: TableStatus;
  tableNumber?: number | string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onContextMenu?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Props internas para o Hook de Estilos (JSS) */
interface StyleProps extends StatusStyleConfig {
  colorScheme: MantineColorScheme;
}

// =============================================================================
// 2. CONFIGURAÇÕES DE ESTADO (Mapeamento de Status)
// =============================================================================

const defaultStatusStyle: StatusStyleConfig = {
  size: 'xl',
  radius: 'md',
  hoverOpacity: 0.9,
  backgroundColor: '',
  transition: 'all 200ms ease-in-out',
  padding: '12px 20px',
};

/** Mapeia o status da mesa para sua respectiva configuração visual */
export const statusVenueTableMap: Record<TableStatus, StatusStyleConfig> = {
  open: {
    ...defaultStatusStyle,
    backgroundColor: TABLE_OPEN_PASTEL,
  },
  requesting_order: {
    ...defaultStatusStyle,
    backgroundColor: TABLE_REQUESTING_ORDER_PASTEL,
  },
  requesting_close: {
    ...defaultStatusStyle,
    backgroundColor: TABLE_REQUESTING_CLOSE_PASTEL,
  },
};

// =============================================================================
// 3. HOOK DE ESTILOS (JSS)
// =============================================================================

export const useStyles = createUseStyles({
  button: {
    '--table-bg': (props: StyleProps) => props.backgroundColor,
    
    backgroundColor: 'var(--table-bg) !important',
    color: `${TEXT_PRIMARY} !important`,
    border: '0 !important',
    outline: 'none !important',
    opacity: 1,
    transition: (props: StyleProps) => props.transition,

    '& *': {
      color: 'inherit !important',
    },

    '&:hover': {
      backgroundColor: (props: StyleProps) => 
        `color-mix(in srgb, var(--table-bg), transparent ${
          (1 - (props.hoverOpacity ?? 0.9)) * 100
        }%) !important`,
    },
    
    '&:focus': {
      outline: 'none !important',
    },
    
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
});
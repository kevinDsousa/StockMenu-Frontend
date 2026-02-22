import { TABLE_OPEN_PASTEL, TABLE_REQUESTING_CLOSE_PASTEL, TABLE_REQUESTING_ORDER_PASTEL, TEXT_PRIMARY } from '@/theme';
import type { MantineColorScheme } from '@mantine/core';
import { createUseStyles } from 'react-jss';

// =============================================================================
// 1. TIPAGENS (Interfaces e Types)
// =============================================================================

export type TableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TableStatus = 'open' | 'requesting_order' | 'requesting_close';

/** Configuração de estilo para cada estado da mesa */
export interface StatusStyleConfig {
  backgroundColor: string;
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
  onClick?: () => void;
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
  transition: 'all 150ms ease',
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
    // Variáveis CSS para facilitar reuso e performance
    '--table-bg': (props: StyleProps) => props.backgroundColor,
    
    // Base do Botão
    backgroundColor: 'var(--table-bg) !important',
    color: TEXT_PRIMARY,
    transition: (props: StyleProps) => props.transition,
    border: '0 !important',
    outline: 'none !important',
    opacity: 1,

    // Garante que o texto/ícones internos herdem a cor primária
    '& *': {
      color: 'inherit !important',
    },

    // Estado: Hover
    '&:hover': {
      // Aplica transparência apenas no fundo sem afetar o texto
      backgroundColor: (props: StyleProps) => 
        `color-mix(in srgb, var(--table-bg), transparent ${
          (1 - (props.hoverOpacity ?? 0.9)) * 100
        }%) !important`,
    },
    
    // Estado: Focus (Acessibilidade)
    '&:focus': {
      outline: 'none !important',
    },
    
    // Estado: Click (Feedback Tátil)
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
});
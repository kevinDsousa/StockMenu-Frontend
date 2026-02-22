/**
 * Constantes de cores do sistema StockMenu
 * 
 * Use estas constantes para manter consistência visual em todo o app.
 * As cores são definidas em formato hex e podem ser usadas diretamente
 * ou através do tema Mantine (theme.other).
 */

// Cores da marca
export const BRAND_PRIMARY = '#228be6' // blue-6 do Mantine
export const BRAND_SECONDARY = '#40c057' // green-6 do Mantine

// Cores semânticas
export const SUCCESS = '#51cf66' // green-5
export const ERROR = '#ff6b6b' // red-5
export const WARNING = '#ffd43b' // yellow-5
export const INFO = '#74c0fc' // blue-3

// Cores de status (para pedidos, mesas, etc.)
export const STATUS_AVAILABLE = SUCCESS
export const STATUS_OCCUPIED = WARNING
export const STATUS_RESERVED = INFO
export const STATUS_CLOSED = '#868e96' // gray-6

// Cores pastéis para estados de mesas
export const TABLE_OPEN_PASTEL = '#d3f9d8' // verde pastel - mesa aberta
export const TABLE_REQUESTING_ORDER_PASTEL = '#fff3bf' // amarelo pastel - solicitando pedido
export const TABLE_REQUESTING_CLOSE_PASTEL = '#ffe0e0' // vermelho pastel - solicitando encerramento

// Cores de texto
export const TEXT_PRIMARY = '#212529' // dark-9 (light mode)
export const TEXT_SECONDARY = '#868e96' // gray-6
export const TEXT_DISABLED = '#ced4da' // gray-4
export const TEXT_PRIMARY_DARK = '#ffffff' // white (dark mode)
export const TEXT_SECONDARY_DARK = '#c1c2c5' // gray-4 (dark mode)

// Cores de fundo
export const BG_PRIMARY = '#ffffff' // white (light mode)
export const BG_SECONDARY = '#f8f9fa' // gray-0
export const BG_DARK = '#1a1a1a' // dark mode background

// Cores de borda
export const BORDER_COLOR = '#dee2e6' // gray-4

/**
 * Mapa de cores para uso no tema Mantine (theme.other)
 * Permite acesso via theme.other?.success, theme.other?.error, etc.
 */
export const themeColors = {
  brandPrimary: BRAND_PRIMARY,
  brandSecondary: BRAND_SECONDARY,
  success: SUCCESS,
  error: ERROR,
  warning: WARNING,
  info: INFO,
  statusAvailable: STATUS_AVAILABLE,
  statusOccupied: STATUS_OCCUPIED,
  statusReserved: STATUS_RESERVED,
  statusClosed: STATUS_CLOSED,
  tableOpenPastel: TABLE_OPEN_PASTEL,
  tableRequestingOrderPastel: TABLE_REQUESTING_ORDER_PASTEL,
  tableRequestingClosePastel: TABLE_REQUESTING_CLOSE_PASTEL,
  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textDisabled: TEXT_DISABLED,
  textPrimaryDark: TEXT_PRIMARY_DARK,
  textSecondaryDark: TEXT_SECONDARY_DARK,
  bgPrimary: BG_PRIMARY,
  bgSecondary: BG_SECONDARY,
  bgDark: BG_DARK,
  borderColor: BORDER_COLOR,
} as const

import {
  IconHome2,
  IconBuildingSkyscraper,
  IconPackage,
  IconSun,
  IconMoon,
  IconSettings,
  IconRuler2,
  IconMenu2,
  IconCurrencyDollar,
  IconPencil,
  IconTrash,
  IconPlus,
  IconArrowsExchange,
  IconArrowsSplit,
  IconStack2,
  IconHistory,
  type Icon as TablerIconType,
} from '@tabler/icons-react'

export const iconNames = [
  'home',
  'building',
  'package',
  'sun',
  'moon',
  'settings',
  'ruler',
  'menu',
  'currency',
  'pencil',
  'trash',
  'plus',
  'transfer',
  'split',
  'merge',
  'history',
] as const

export type IconName = (typeof iconNames)[number]

const iconMap: Record<IconName, TablerIconType> = {
  home: IconHome2,
  building: IconBuildingSkyscraper,
  package: IconPackage,
  sun: IconSun,
  moon: IconMoon,
  settings: IconSettings,
  ruler: IconRuler2,
  menu: IconMenu2,
  currency: IconCurrencyDollar,
  pencil: IconPencil,
  trash: IconTrash,
  plus: IconPlus,
  transfer: IconArrowsExchange,
  split: IconArrowsSplit,
  merge: IconStack2,
  history: IconHistory,
}

export interface IconProps {
  name: IconName
  size?: number
  stroke?: number
  color?: string
  className?: string
}

export function Icon({ name, size = 24, stroke = 1.5, color, className }: IconProps) {
  const TablerIcon = iconMap[name]
  return (
    <TablerIcon
      size={size}
      stroke={stroke}
      color={color}
      className={className}
    />
  )
}

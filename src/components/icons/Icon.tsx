import {
  IconHome2,
  IconBuildingSkyscraper,
  IconPackage,
  IconSun,
  IconMoon,
  IconSettings,
  type Icon as TablerIconType,
} from '@tabler/icons-react'

export const iconNames = [
  'home',
  'building',
  'package',
  'sun',
  'moon',
  'settings',
] as const

export type IconName = (typeof iconNames)[number]

const iconMap: Record<IconName, TablerIconType> = {
  home: IconHome2,
  building: IconBuildingSkyscraper,
  package: IconPackage,
  sun: IconSun,
  moon: IconMoon,
  settings: IconSettings,
}

export interface IconProps {
  name: IconName
  size?: number
  stroke?: number
  className?: string
}

export function Icon({ name, size = 24, stroke = 1.5, className }: IconProps) {
  const TablerIcon = iconMap[name]
  return <TablerIcon size={size} stroke={stroke} className={className} />
}

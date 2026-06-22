import * as LucideIcons from "lucide-react"
import { Tag, type LucideIcon, type LucideProps } from "lucide-react"

const iconRegistry = LucideIcons as unknown as Record<string, unknown>

export function getLucideIconByName(iconName?: string | null): LucideIcon {
  const name = iconName?.trim()
  if (!name) return Tag

  const Icon = iconRegistry[name]
  return typeof Icon === "function" ? (Icon as LucideIcon) : Tag
}

export function DynamicLucideIcon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Icon = getLucideIconByName(name)
  // eslint-disable-next-line react-hooks/static-components
  return <Icon {...props} />
}

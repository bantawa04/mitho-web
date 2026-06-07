import { Globe, Lock, type LucideIcon } from "lucide-react"
import type { BadgeProps } from "@/components/mitho/mitho-badge"
import type { CollectionVisibility } from "@/features/collections/data/collection-data"

interface CollectionVisibilityPresentation {
  label: string
  icon: LucideIcon
  badgeVariant: NonNullable<BadgeProps["variant"]>
}

export function getCollectionVisibilityPresentation(visibility: CollectionVisibility): CollectionVisibilityPresentation {
  if (visibility === "public") {
    return {
      label: "Public",
      icon: Globe,
      badgeVariant: "neutral",
    }
  }

  return {
    label: "Private",
    icon: Lock,
    badgeVariant: "muted",
  }
}

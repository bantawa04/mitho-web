"use client"

import type { CollectionVisibility } from "@/types/collections"
import { getCollectionVisibilityPresentation } from "@/features/collections/utils/collection-visibility-utils"
import { MithoBadge } from "@/components/mitho/mitho-badge"

export function CollectionVisibilityBadge({ visibility }: { visibility: CollectionVisibility }) {
  const presentation = getCollectionVisibilityPresentation(visibility)
  const Icon = presentation.icon

  return (
    <MithoBadge variant={presentation.badgeVariant} className="gap-1">
      <Icon className="h-3.5 w-3.5" />
      {presentation.label}
    </MithoBadge>
  )
}

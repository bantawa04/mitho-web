"use client"

import Link from "next/link"
import { ArrowRight, Bookmark } from "lucide-react"
import { getCollectionCoverImages, getCollectionPlaceCount } from "@/features/collections/utils/collection-helpers"
import { getCollectionVisibilityPresentation } from "@/features/collections/utils/collection-visibility-utils"
import type { CollectionRecord } from "@/types/collections"
import { cn } from "@/lib/utils"

function VisibilityPill({ visibility }: { visibility: CollectionRecord["visibility"] }) {
  const presentation = getCollectionVisibilityPresentation(visibility)
  const Icon = presentation.icon

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide text-white">
      <Icon className="h-3 w-3" />
      {presentation.label}
    </span>
  )
}

function formatUpdatedLabel(updatedAt: string) {
  const value = new Date(updatedAt)
  if (Number.isNaN(value.getTime())) return "Updated recently"
  return `Updated ${value.toLocaleDateString()}`
}

export function CollectionShowcaseCard({
  collection,
  href,
  showStatus = false,
  className,
}: {
  collection: CollectionRecord
  href: string
  showStatus?: boolean
  className?: string
}) {
  const coverImages = getCollectionCoverImages(collection)
  const itemCount = getCollectionPlaceCount(collection)
  const coverImage = coverImages[0]

  return (
    <Link
      href={href}
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-sm",
        className,
      )}
    >
      {coverImage ? (
        <img
          src={coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-brand-deep-green/38">
          <Bookmark className="h-8 w-8" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute left-4 top-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide text-white">
          <Bookmark className="h-3 w-3" />
          {itemCount} {itemCount === 1 ? "place" : "places"}
        </span>
      </div>

      <div className="absolute right-4 top-4">
        {showStatus && (
          <VisibilityPill visibility={collection.visibility} />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-12">
        <h3 className="font-heading text-[1.1rem] font-bold leading-snug tracking-tight text-white sm:text-[1.2rem]">
          {collection.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3 text-[0.72rem] font-semibold text-white/78 transition-colors duration-200 group-hover:text-white">
          <div className="flex items-center gap-2">
            <span>
              {itemCount} {itemCount === 1 ? "place" : "places"}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/45" />
            <span>{formatUpdatedLabel(collection.updatedAt)}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </div>
      </div>
    </Link>
  )
}

"use client"

import * as React from "react"
import { Camera, ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BusinessGalleryItem } from "@/components/business/business-detail-types"

interface BusinessGalleryPreviewProps {
  items: BusinessGalleryItem[]
  totalCount?: number
  emptyMessage?: string
  className?: string
}

export function BusinessGalleryPreview({
  items,
  totalCount,
  emptyMessage = "This business has not uploaded photos yet.",
  className,
}: BusinessGalleryPreviewProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const visibleItems = items.slice(0, 5)
  const effectiveTotal = totalCount ?? items.length
  const moreCount = Math.max(effectiveTotal - visibleItems.length, 0)

  const closeLightbox = () => setSelectedIndex(null)
  const goNext = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0))
  const goPrev = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0))

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (event.key === "Escape") closeLightbox()
      if (event.key === "ArrowRight") goNext()
      if (event.key === "ArrowLeft") goPrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex])

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-brand-deep-green/12 bg-white/72 px-6 py-10 text-center",
          className,
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft-beige text-brand-dark-green">
          <Camera className="h-7 w-7" />
        </div>
        <p className="mt-5 text-xl font-semibold text-brand-dark-green">Photos coming soon</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", className)}>
        {visibleItems.map((item, index) => {
          const isOverlayTile = index === visibleItems.length - 1 && moreCount > 0
          return (
            <button
              key={`${item.alt}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
              )}
            >
              <img
                src={item.type === "video" ? item.thumbnail || item.src : item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                    <Play className="ml-0.5 h-5 w-5 fill-brand-orange text-brand-orange" />
                  </div>
                </div>
              )}
              {isOverlayTile && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 text-left text-white">
                  <div>
                    <p className="text-lg font-semibold">+{moreCount} more</p>
                    <p className="text-sm text-white/80">See the full gallery</p>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeLightbox}>
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 p-2 text-white transition-colors hover:text-brand-orange"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              goPrev()
            }}
            className="absolute left-4 p-2 text-white transition-colors hover:text-brand-orange"
            aria-label="Previous"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              goNext()
            }}
            className="absolute right-4 p-2 text-white transition-colors hover:text-brand-orange"
            aria-label="Next"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="mx-4 max-h-[80vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            {items[selectedIndex].type === "video" ? (
              <video src={items[selectedIndex].src} controls autoPlay className="max-h-[80vh] max-w-full rounded-xl" />
            ) : (
              <img
                src={items[selectedIndex].src}
                alt={items[selectedIndex].alt}
                className="max-h-[80vh] max-w-full rounded-xl object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white">
            {selectedIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  )
}

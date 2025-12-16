"use client"

import * as React from "react"
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryItem {
  type: "image" | "video"
  src: string
  alt: string
  thumbnail?: string
}

interface ImageGalleryProps {
  items: GalleryItem[]
  className?: string
}

export function MithoImageGallery({ items, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const goNext = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0))
  const goPrev = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0))

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex])

  return (
    <>
      <div
        ref={scrollRef}
        className={cn("flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2", className)}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => openLightbox(index)}
            className="relative flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 md:w-48 md:h-32 rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
            <img
              src={item.type === "video" ? item.thumbnail || item.src : item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-5 w-5 text-brand-orange fill-brand-orange ml-0.5" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:text-brand-orange transition-colors"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-4 p-2 text-white hover:text-brand-orange transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-4 p-2 text-white hover:text-brand-orange transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="max-w-4xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
            {items[selectedIndex].type === "video" ? (
              <video src={items[selectedIndex].src} controls autoPlay className="max-w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img
                src={items[selectedIndex].src || "/placeholder.svg"}
                alt={items[selectedIndex].alt}
                className="max-w-full max-h-[80vh] rounded-xl object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  )
}

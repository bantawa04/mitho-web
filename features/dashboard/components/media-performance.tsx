"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Film, ImageIcon, Trash2, Upload } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoBadge } from "@/components/mitho/mitho-badge"

type MediaType = "image" | "video"
type MediaFilter = "all" | MediaType

const uploadedMedia = [
  {
    id: "media-dal-bhat",
    title: "Dining room hero shot",
    uploadedAt: "Uploaded 2 weeks ago",
    status: "Live",
    src: "/dal-bhat-nepali-meal-set.jpg",
    type: "image" as const,
  },
  {
    id: "media-momo-platter",
    title: "Steamed momo platter",
    uploadedAt: "Uploaded 10 days ago",
    status: "Live",
    src: "/nepali-momo-dumplings-restaurant.jpg",
    type: "image" as const,
  },
  {
    id: "media-interior",
    title: "Window-side seating",
    uploadedAt: "Uploaded 6 days ago",
    status: "Needs caption",
    src: "/restaurant-interior-cozy.jpg",
    type: "image" as const,
  },
  {
    id: "media-sekuwa",
    title: "Sekuwa close-up",
    uploadedAt: "Uploaded 3 days ago",
    status: "Awaiting approval",
    src: "/sekuwa-nepali-grilled-meat.jpg",
    type: "image" as const,
  },
  {
    id: "media-chiya",
    title: "Morning chiya setup",
    uploadedAt: "Uploaded 2 days ago",
    status: "Live",
    src: "/nepali-tea-house-chiya.jpg",
    type: "image" as const,
  },
  {
    id: "media-dining-corner",
    title: "Corner table details",
    uploadedAt: "Uploaded yesterday",
    status: "Live",
    src: "/nepali-restaurant-traditional-interior.jpg",
    type: "image" as const,
  },
  {
    id: "media-video-kitchen",
    title: "Kitchen plating reel",
    uploadedAt: "Uploaded 5 days ago",
    status: "Live",
    src: "/chef-cooking-nepali-food.jpg",
    type: "video" as const,
  },
  {
    id: "media-video-thali",
    title: "Thali service clip",
    uploadedAt: "Uploaded 1 week ago",
    status: "Awaiting approval",
    src: "/nepali-thali-plate.jpg",
    type: "video" as const,
  },
  {
    id: "media-video-momo",
    title: "Momo steam table clip",
    uploadedAt: "Uploaded 12 days ago",
    status: "Needs caption",
    src: "/steamed-momo-nepali-dumplings.jpg",
    type: "video" as const,
  },
  {
    id: "media-video-room",
    title: "Dinner rush walkthrough",
    uploadedAt: "Uploaded 2 weeks ago",
    status: "Live",
    src: "/nepali-restaurant-thakali-food.jpg",
    type: "video" as const,
  },
]

const filters: Array<{ key: MediaFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "image", label: "Image" },
  { key: "video", label: "Videos" },
]

export function MediaPerformance() {
  const [activeFilter, setActiveFilter] = useState<MediaFilter>("all")

  const counts = useMemo(
    () => ({
      all: uploadedMedia.length,
      image: uploadedMedia.filter((item) => item.type === "image").length,
      video: uploadedMedia.filter((item) => item.type === "video").length,
    }),
    [],
  )

  const visibleMedia = useMemo(() => {
    if (activeFilter === "all") return uploadedMedia
    return uploadedMedia.filter((item) => item.type === activeFilter)
  }, [activeFilter])

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="type-section-title text-foreground">Media performance</h2>
          <p className="type-meta mt-1">Business-uploaded images and videos that customers see on the listing.</p>
        </div>
        <MithoButton variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />} className="w-full sm:w-auto">
          Upload media
        </MithoButton>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-4">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          const count = counts[filter.key]

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand-deep-green/20"
              }
            >
              {filter.key === "image" ? <ImageIcon className="h-4 w-4" /> : null}
              {filter.key === "video" ? <Film className="h-4 w-4" /> : null}
              <span>
                {filter.label} ({count})
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleMedia.map((media) => (
          <div
            key={media.id}
            className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3]">
              <Image src={media.src} alt={media.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              {media.type === "video" ? (
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-lg bg-white/92 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                  <Film className="h-3.5 w-3.5 text-muted-foreground" />
                  Video
                </div>
              ) : null}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{media.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{media.uploadedAt}</p>
                </div>
                <MithoBadge variant="neutral" size="sm">
                  {media.status}
                </MithoBadge>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-danger transition-colors hover:text-danger/80"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

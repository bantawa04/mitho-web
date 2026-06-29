"use client"

import Link from "next/link"
import { useRef } from "react"
import { ChevronRight, ImageIcon, Loader2, Upload, Video } from "lucide-react"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { useMedia, useUploadMedia } from "@/hooks/use-media"
import type { Media } from "@/types/media"
import { MediaImage } from "@/components/mitho/media-image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function MediaCard({ item }: { item: Media }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {item.mediaType === "image" ? (
          <MediaImage
            media={item}
            variant="card"
            fallback={item.publicUrl}
            alt={item.altText ?? item.filename}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Video className="h-10 w-10 text-brand-deep-green/30" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {item.mediaType === "image" ? (
              <ImageIcon className="h-3 w-3" />
            ) : (
              <Video className="h-3 w-3" />
            )}
            {item.mediaType}
          </span>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="truncate text-sm font-medium text-foreground">{item.filename}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {item.sizeBytes ? formatBytes(item.sizeBytes) : "—"}
          </span>
          <span className="text-xs text-muted-foreground">{formatAdminDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

function UploadingCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted p-8">
      <Loader2 className="h-8 w-8 animate-spin text-brand-deep-green/40" />
      <p className="text-sm text-muted-foreground">Uploading…</p>
    </div>
  )
}

export function AdminMediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: mediaItems, isLoading, isError } = useMedia({ scope: "all" })
  const uploadMutation = useUploadMedia()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    for (const file of files) {
      uploadMutation.mutate({ file })
    }

    event.target.value = ""
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Media</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Media</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Upload and manage images and videos used across listings and the platform.
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif,video/mp4,video/webm"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
            <Button
              size="lg"
              className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload media
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
          <p className="font-semibold text-red-700">Failed to load media</p>
          <p className="mt-1 text-sm text-red-600">Please refresh the page or try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-white">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-2 px-4 py-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {uploadMutation.isPending && <UploadingCard />}
          {mediaItems && mediaItems.length > 0 ? (
            mediaItems.map((item) => <MediaCard key={item.id} item={item} />)
          ) : !uploadMutation.isPending ? (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-brand-deep-green/20" />
              <p className="mt-4 font-semibold text-foreground">No media yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Upload your first image or video using the button above.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

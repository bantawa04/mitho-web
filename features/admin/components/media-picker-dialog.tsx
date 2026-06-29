"use client"

import { useRef, useState } from "react"
import { Check, ImageIcon, Loader2, Upload, Video } from "lucide-react"
import { useMedia, useUploadMedia } from "@/hooks/use-media"
import type { Media, MediaType } from "@/types/media"
import { MediaImage } from "@/components/mitho/media-image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect?: (media: Media) => void
  onSelectMany?: (media: Media[]) => void
  multiple?: boolean
  accept?: "image" | "video" | "all"
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getAcceptAttribute(accept: "image" | "video" | "all") {
  if (accept === "image") return "image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif"
  if (accept === "video") return "video/mp4,video/webm"
  return "image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif,video/mp4,video/webm"
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  onSelectMany,
  multiple = false,
  accept = "all",
}: MediaPickerDialogProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library")
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: mediaItems, isLoading, isError } = useMedia()
  const uploadMutation = useUploadMedia()

  const filteredMedia = mediaItems?.filter((item) => {
    if (accept !== "all" && item.mediaType !== accept) return false
    if (typeFilter !== "all" && item.mediaType !== typeFilter) return false
    return true
  })

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (multiple) {
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
      } else {
        if (next.has(id)) {
          next.clear()
        } else {
          next.clear()
          next.add(id)
        }
      }
      return next
    })
  }

  function handleConfirm() {
    if (!mediaItems) return
    const selected = mediaItems.filter((item) => selectedIds.has(item.id))
    if (selected.length > 0) {
      if (multiple) {
        onSelectMany?.(selected)
      } else {
        onSelect?.(selected[0])
      }
      onOpenChange(false)
      setSelectedIds(new Set())
    }
  }

  async function handleFiles(files: File[]) {
    if (files.length === 0) return
    const uploadedItems: Media[] = []
    for (const file of files) {
      const uploaded = await uploadMutation.mutateAsync({ file })
      uploadedItems.push(uploaded)
    }

    setSelectedIds(new Set(uploadedItems.map((item) => item.id)))
    setActiveTab("library")
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    handleFiles(files)
    event.target.value = ""
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const files = Array.from(event.dataTransfer.files)
    handleFiles(files)
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setSelectedIds(new Set())
          setActiveTab("library")
          setTypeFilter("all")
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden rounded-xl border-brand-deep-green/10 p-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <DialogHeader className="border-b border-brand-deep-green/10 px-6 py-5">
          <DialogTitle className="text-lg font-semibold text-brand-dark-green">Select media</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose from your library or upload a new file.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "library" | "upload")}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="border-b border-brand-deep-green/10 px-6 pt-4 pb-3">
            <TabsList className="h-10 rounded-xl bg-muted">
              <TabsTrigger value="library" className="rounded-lg px-4 text-sm">
                Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="rounded-lg px-4 text-sm">
                Upload
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 overflow-y-auto p-6">
            {/* Type filter */}
            {accept === "all" && (
              <div className="mb-4 flex gap-2">
                {(["all", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      typeFilter === t
                        ? "border-brand-dark-green bg-brand-dark-green text-white"
                        : "border-brand-deep-green/10 bg-white text-brand-dark-green hover:bg-muted"
                    }`}
                  >
                    {t === "all" ? "All" : t === "image" ? "Images" : "Videos"}
                  </button>
                ))}
              </div>
            )}

            {isError ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-8 text-center">
                <p className="text-sm font-semibold text-red-700">Failed to load media</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : filteredMedia && filteredMedia.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filteredMedia.map((item) => {
                  const isSelected = selectedIds.has(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSelection(item.id)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                        isSelected
                          ? "border-brand-dark-green shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
                          : "border-brand-deep-green/10 hover:border-brand-deep-green/30"
                      }`}
                    >
                      {item.mediaType === "image" ? (
                        <MediaImage
                          media={item}
                          variant="thumb"
                          fallback={item.publicUrl}
                          alt={item.altText ?? item.filename}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Video className="h-8 w-8 text-brand-deep-green/30" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-brand-dark-green/20">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white shadow">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ImageIcon className="h-12 w-12 text-brand-deep-green/20" />
                <p className="mt-4 font-semibold text-brand-dark-green">No media in your library</p>
                <p className="mt-1 text-sm text-muted-foreground">Switch to the Upload tab to add your first file.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-y-auto p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptAttribute(accept)}
              multiple={multiple}
              className="sr-only"
              onChange={handleFileInputChange}
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
              className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-brand-dark-green bg-muted"
                  : "border-brand-deep-green/20 bg-muted/60 hover:border-brand-deep-green/40 hover:bg-muted"
              } ${uploadMutation.isPending ? "cursor-default opacity-70" : ""}`}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-brand-deep-green/40" />
                  <p className="text-sm font-medium text-muted-foreground">Uploading…</p>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Upload className="h-6 w-6 text-brand-dark-green" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-brand-dark-green">
                      {multiple ? "Drop files here, or click to browse" : "Drop a file here, or click to browse"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {accept === "image"
                        ? "JPEG, PNG, WebP, GIF"
                        : accept === "video"
                          ? "MP4, WebM"
                          : "JPEG, PNG, WebP, GIF, MP4, WebM"}
                      {multiple ? " • multiple upload supported" : ""}
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-brand-deep-green/10 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0 || uploadMutation.isPending}
          >
            Use selected
            {selectedIds.size > 0 && ` (${selectedIds.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

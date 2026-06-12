"use client"

import { useMemo, useState } from "react"
import { Film, ImageIcon, Pencil, Trash2, Upload } from "lucide-react"
import { MediaPickerDialog } from "@/features/admin/components/media-picker-dialog"
import { useAddGalleryItems, useBusinessGallery, useDeleteGalleryItem, useUpdateGalleryItem } from "@/hooks/use-gallery"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { BusinessGalleryItem, GalleryItemStatus } from "@/types/gallery"
import type { Media } from "@/types/media"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"

type MediaFilter = "all" | "image" | "video"

const filters: Array<{ key: MediaFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "image", label: "Image" },
  { key: "video", label: "Videos" },
]

function statusPresentation(status: GalleryItemStatus) {
  switch (status) {
    case "approved":
      return { label: "Approved", variant: "success" as const }
    case "rejected":
      return { label: "Rejected", variant: "danger" as const }
    default:
      return { label: "Awaiting approval", variant: "neutral" as const }
  }
}

function formatUploadedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return `Uploaded ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
}

interface PendingGalleryEntry {
  media: Media
  title: string
}

export function BusinessGallery({ businessId }: { businessId: string }) {
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState<MediaFilter>("all")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pendingEntries, setPendingEntries] = useState<PendingGalleryEntry[]>([])
  const [editingItem, setEditingItem] = useState<BusinessGalleryItem | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [itemPendingDelete, setItemPendingDelete] = useState<BusinessGalleryItem | null>(null)

  const galleryQuery = useBusinessGallery(businessId)
  const addItems = useAddGalleryItems(businessId)
  const updateItem = useUpdateGalleryItem(businessId)
  const deleteItem = useDeleteGalleryItem(businessId)

  const items = galleryQuery.data ?? []

  const counts = useMemo(
    () => ({
      all: items.length,
      image: items.filter((item) => item.media.mediaType === "image").length,
      video: items.filter((item) => item.media.mediaType === "video").length,
    }),
    [items],
  )

  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return items
    return items.filter((item) => item.media.mediaType === activeFilter)
  }, [items, activeFilter])

  function handlePickerSelection(selected: Media[]) {
    const attachedMediaIds = new Set(items.map((item) => item.media.id))
    const fresh = selected.filter((media) => !attachedMediaIds.has(media.id))
    if (fresh.length === 0) {
      toast({ title: "Already in gallery", description: "The selected media is already part of this gallery." })
      return
    }
    setPendingEntries(fresh.map((media) => ({ media, title: media.title ?? "" })))
  }

  async function submitPendingEntries() {
    try {
      await addItems.mutateAsync({
        items: pendingEntries.map((entry) => ({
          mediaId: entry.media.id,
          title: entry.title.trim() || undefined,
        })),
      })
      toast({
        title: "Media submitted for approval",
        description: "New gallery items stay hidden from the public page until an admin approves them.",
      })
      setPendingEntries([])
    } catch (error) {
      toast({ title: "Could not add media", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  async function submitTitleEdit() {
    if (!editingItem) return
    try {
      await updateItem.mutateAsync({
        attachmentId: editingItem.id,
        payload: { title: editingTitle.trim() || undefined },
      })
      toast({ title: "Details saved" })
      setEditingItem(null)
    } catch (error) {
      toast({ title: "Could not save details", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  async function confirmDelete() {
    if (!itemPendingDelete) return
    try {
      await deleteItem.mutateAsync(itemPendingDelete.id)
      toast({ title: "Media removed from gallery" })
      setItemPendingDelete(null)
    } catch (error) {
      toast({ title: "Could not remove media", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  return (
    <section className="py-8">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="type-section-title text-foreground">Photo & video gallery</h2>
          <p className="type-meta mt-1">
            Images and videos shown on the public listing. New uploads go live after admin approval.
          </p>
        </div>
        <MithoButton
          variant="secondary"
          size="sm"
          leftIcon={<Upload className="h-4 w-4" />}
          className="w-full sm:w-auto"
          onClick={() => setPickerOpen(true)}
        >
          Upload media
        </MithoButton>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 border-b border-brand-deep-green/10 pb-5">
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
                  ? "inline-flex items-center gap-2 rounded-full bg-brand-deep-green px-4 py-2 text-sm font-semibold text-white"
                  : "inline-flex items-center gap-2 rounded-full border border-brand-deep-green/12 bg-white px-4 py-2 text-sm font-semibold text-brand-dark-green transition-colors hover:border-brand-deep-green/20"
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

      {galleryQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-[1.2rem]" />
          ))}
        </div>
      ) : galleryQuery.isError ? (
        <div className="rounded-[1.2rem] border border-danger/15 bg-danger/5 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-danger">Unable to load the gallery. Please try again.</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-[1.2rem] border border-dashed border-brand-deep-green/20 bg-brand-soft-beige/10 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-foreground">No media here yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload photos or videos of your dishes and space so customers can see what to expect.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleItems.map((item) => {
            const status = statusPresentation(item.status)
            const displayTitle = item.title || item.media.title || item.media.filename

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[1.2rem] border border-brand-deep-green/10 bg-white shadow-[0_6px_18px_rgba(10,70,53,0.04)]"
              >
                <div className="relative aspect-[4/3] bg-brand-soft-beige/20">
                  {item.media.mediaType === "video" ? (
                    <video
                      src={item.media.publicUrl}
                      className="h-full w-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                      controls
                    />
                  ) : (
                    // Gallery sources come from R2; next/image needs remote-domain config, so use img.
                    <img
                      src={item.media.publicUrl}
                      alt={item.media.altText ?? displayTitle}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {item.media.mediaType === "video" ? (
                    <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-brand-dark-green shadow-[0_8px_20px_rgba(10,70,53,0.12)]">
                      <Film className="h-3.5 w-3.5 text-brand-orange" />
                      Video
                    </div>
                  ) : null}
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-foreground">{displayTitle}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">{formatUploadedAt(item.createdAt)}</p>
                    </div>
                    <MithoBadge variant={status.variant} size="sm">
                      {status.label}
                    </MithoBadge>
                  </div>
                  {item.status === "rejected" && item.rejectionReason ? (
                    <p className="rounded-[0.8rem] border border-danger/15 bg-danger/5 px-3 py-2 text-xs leading-5 text-danger">
                      {item.rejectionReason}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item)
                        setEditingTitle(item.title ?? "")
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark-green transition-colors hover:text-brand-dark-green/75"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit title
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemPendingDelete(item)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-danger transition-colors hover:text-danger/80"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        accept="all"
        multiple
        onSelectMany={handlePickerSelection}
      />

      <Dialog
        open={pendingEntries.length > 0}
        onOpenChange={(open) => {
          if (!open && !addItems.isPending) setPendingEntries([])
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add to gallery</DialogTitle>
            <DialogDescription>
              Give each item a short title so customers know what they are looking at. Items go live after admin
              approval.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1">
            {pendingEntries.map((entry, index) => (
              <div key={entry.media.id} className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/20">
                  {entry.media.mediaType === "video" ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-6 w-6 text-brand-deep-green/40" />
                    </div>
                  ) : (
                    <img src={entry.media.publicUrl} alt={entry.media.filename} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="truncate text-xs text-muted-foreground">{entry.media.filename}</p>
                  <Input
                    value={entry.title}
                    onChange={(event) =>
                      setPendingEntries((current) =>
                        current.map((candidate, candidateIndex) =>
                          candidateIndex === index ? { ...candidate, title: event.target.value } : candidate,
                        ),
                      )
                    }
                    placeholder="Title (optional)"
                    maxLength={255}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <MithoButton variant="outline-secondary" onClick={() => setPendingEntries([])} disabled={addItems.isPending}>
              Cancel
            </MithoButton>
            <MithoButton onClick={submitPendingEntries} disabled={addItems.isPending}>
              {addItems.isPending ? "Submitting…" : `Submit for approval (${pendingEntries.length})`}
            </MithoButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingItem !== null}
        onOpenChange={(open) => {
          if (!open && !updateItem.isPending) setEditingItem(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit title</DialogTitle>
            <DialogDescription>This title is stored with the gallery item.</DialogDescription>
          </DialogHeader>
          <Input
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            placeholder="e.g. Steamed momo platter"
            maxLength={255}
          />
          <DialogFooter>
            <MithoButton variant="outline-secondary" onClick={() => setEditingItem(null)} disabled={updateItem.isPending}>
              Cancel
            </MithoButton>
            <MithoButton onClick={submitTitleEdit} disabled={updateItem.isPending}>
              {updateItem.isPending ? "Saving…" : "Save title"}
            </MithoButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={itemPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteItem.isPending) setItemPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this media from the gallery?</AlertDialogTitle>
            <AlertDialogDescription>
              It will no longer appear on the public listing. The file stays in your media library, so you can add it
              back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItem.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-danger-foreground hover:bg-danger/90"
              onClick={confirmDelete}
              disabled={deleteItem.isPending}
            >
              {deleteItem.isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

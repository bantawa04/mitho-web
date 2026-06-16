"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Film } from "lucide-react"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { useAdminGallery, useApproveAdminGalleryItem, useRejectAdminGalleryItem } from "@/hooks/use-admin-gallery"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { AdminGalleryItem, GalleryItemStatus } from "@/types/gallery"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const galleryStatuses: Array<"all" | GalleryItemStatus> = ["all", "pending", "approved", "rejected"]
const mediaTypeFilters = ["all", "image", "video"] as const

function getStatusTone(status: GalleryItemStatus) {
  switch (status) {
    case "pending":
      return "bg-muted text-foreground border-border"
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-100"
  }
}

function formatStatus(status: GalleryItemStatus) {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
  }
}

function displayTitle(item: AdminGalleryItem) {
  return item.title || item.media.title || item.media.filename
}

export function AdminGalleryApprovalPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<"all" | GalleryItemStatus>("pending")
  const [typeFilter, setTypeFilter] = useState<(typeof mediaTypeFilters)[number]>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedDecision, setSelectedDecision] = useState<"approved" | "rejected">("approved")
  const [rejectionReason, setRejectionReason] = useState("")

  const galleryQuery = useAdminGallery({
    page: currentPage,
    perPage: pageSize,
    status: statusFilter === "all" ? "" : statusFilter,
    type: typeFilter === "all" ? "" : typeFilter,
    search: debouncedQuery,
  })
  const approveItem = useApproveAdminGalleryItem()
  const rejectItem = useRejectAdminGalleryItem()

  const selectedItem = useMemo(
    () => galleryQuery.data?.items.find((item) => item.id === selectedItemId) ?? null,
    [galleryQuery.data?.items, selectedItemId],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter, typeFilter])

  useEffect(() => {
    if (!selectedItem) return
    if (selectedItem.status === "approved") {
      setSelectedDecision("rejected")
    } else {
      setSelectedDecision("approved")
    }
    setRejectionReason(selectedItem.rejectionReason ?? "")
  }, [selectedItem])

  const resultSummary =
    !galleryQuery.data || galleryQuery.data.meta.total === 0
      ? "No gallery items match this view."
      : `Showing ${(galleryQuery.data.meta.page - 1) * galleryQuery.data.meta.perPage + 1}-${Math.min(galleryQuery.data.meta.page * galleryQuery.data.meta.perPage, galleryQuery.data.meta.total)} of ${galleryQuery.data.meta.total}`

  const columns = useMemo<AdminTableColumn<AdminGalleryItem>[]>(
    () => [
      {
        id: "media",
        label: "Media",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
              {item.media.mediaType === "video" ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Film className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                <img src={item.media.publicUrl} alt={displayTitle(item)} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="max-w-[16rem] truncate text-sm font-semibold text-foreground">{displayTitle(item)}</p>
              <p className="text-xs capitalize text-muted-foreground">{item.media.mediaType}</p>
            </div>
          </div>
        ),
      },
      {
        id: "business",
        label: "Business",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm font-medium text-foreground",
        cell: (item) => item.business.name || "Unknown business",
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (item) => <AdminStatusBadge label={formatStatus(item.status)} tone={getStatusTone(item.status)} />,
      },
      {
        id: "submitted",
        label: "Submitted",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (item) => formatAdminDate(item.createdAt),
      },
      {
        id: "action",
        label: "Action",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (item) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "Review",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => setSelectedItemId(item.id),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  async function applyDecision() {
    if (!selectedItem) return

    try {
      if (selectedDecision === "approved") {
        await approveItem.mutateAsync(selectedItem.id)
        toast({ title: "Gallery item approved", description: "It is now visible on the public business page." })
      } else {
        await rejectItem.mutateAsync({
          id: selectedItem.id,
          payload: { rejectionReason: rejectionReason.trim() },
        })
        toast({ title: "Gallery item rejected" })
      }
      setSelectedItemId(null)
    } catch (error) {
      toast({
        title: "Could not update gallery item",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  const decisionMatchesCurrentStatus = selectedItem ? selectedItem.status === selectedDecision : false

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Gallery Approval</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Gallery Approval</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Review business-uploaded photos and videos before they appear on the public listing pages.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={galleryQuery.data?.items ?? []}
          rowKey={(item) => item.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search businesses or media titles"
          leftToolbarContent={
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | GalleryItemStatus)}>
                <SelectTrigger className="h-11 w-[170px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {galleryStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All" : formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-muted-foreground">Type</span>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as (typeof mediaTypeFilters)[number])}
              >
                <SelectTrigger className="h-11 w-[140px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypeFilters.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All" : type === "image" ? "Images" : "Videos"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          currentPage={galleryQuery.data?.meta.page ?? currentPage}
          totalPages={galleryQuery.data?.meta.totalPages ?? 1}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          resultSummary={resultSummary}
          emptyTitle="No gallery items match this view."
          emptyDescription="Try clearing the search or switching the status filter."
          isLoading={galleryQuery.isLoading}
        />
      </div>

      <AdminModal
        open={selectedItemId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedItemId(null)
        }}
        title="Gallery moderation"
        description="Inspect the media, then approve or reject it."
        confirmLabel={selectedDecision === "approved" ? "Approve media" : "Reject media"}
        cancelLabel="Close"
        onConfirm={applyDecision}
        size="lg"
        bodyClassName="space-y-6"
        isConfirmDisabled={
          decisionMatchesCurrentStatus || (selectedDecision === "rejected" && !rejectionReason.trim())
        }
        isLoading={approveItem.isPending || rejectItem.isPending}
        showFooter={Boolean(selectedItem)}
      >
        {selectedItem ? (
          <>
            <section className="space-y-4 border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <AdminStatusBadge label={formatStatus(selectedItem.status)} tone={getStatusTone(selectedItem.status)} />
                <AdminStatusBadge
                  label={selectedItem.media.mediaType === "video" ? "Video" : "Image"}
                  tone="bg-muted text-foreground border-border"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Business</p>
                  <p className="text-base font-semibold text-foreground">
                    {selectedItem.business.name || "Unknown business"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Title</p>
                  <p className="text-base font-semibold text-foreground">{displayTitle(selectedItem)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base font-semibold text-foreground">{formatAdminDate(selectedItem.createdAt)}</p>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-b border-border pb-5">
              <div className="overflow-hidden rounded-xl border border-border bg-muted">
                {selectedItem.media.mediaType === "video" ? (
                  <video src={selectedItem.media.publicUrl} className="max-h-96 w-full object-contain" controls playsInline />
                ) : (
                  <img
                    src={selectedItem.media.publicUrl}
                    alt={displayTitle(selectedItem)}
                    className="max-h-96 w-full object-contain"
                  />
                )}
              </div>
              {selectedItem.status === "rejected" && selectedItem.rejectionReason ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Current rejection reason: {selectedItem.rejectionReason}
                </p>
              ) : null}
            </section>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Moderation decision</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedItem.status === "pending"
                    ? "Choose whether this media should be visible to customers."
                    : "This item has already been moderated. You can still change the decision."}
                </p>
              </div>
              <RadioGroup
                value={selectedDecision}
                onValueChange={(value) => setSelectedDecision(value as "approved" | "rejected")}
                className="gap-3"
              >
                {[
                  { value: "approved", title: "Approve media", description: "Show it on the public business page." },
                  {
                    value: "rejected",
                    title: "Reject media",
                    description: "Keep it off the public page and tell the owner why.",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted"
                  >
                    <RadioGroupItem value={option.value} className="mt-1" />
                    <span className="space-y-1">
                      <span className="block text-sm font-semibold text-foreground">{option.title}</span>
                      <span className="block text-sm leading-6 text-muted-foreground">{option.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {selectedDecision === "rejected" ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Rejection reason *</p>
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-[1rem] border border-brand-deep-green/10 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/12"
                    placeholder="Tell the business owner why this media was rejected."
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </AdminModal>
    </>
  )
}

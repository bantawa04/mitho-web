"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Trash2 } from "lucide-react"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminConfirmModal, AdminModal } from "@/features/admin/components/admin-modal"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { useApproveAdminReview, useAdminReview, useAdminReviews, useDeleteAdminReview, useRejectAdminReview } from "@/hooks/use-reviews"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { ReviewItem, ReviewRejectionFlag, ReviewStatus } from "@/types/reviews"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reviewStatuses: Array<"all" | ReviewStatus> = ["all", "pending", "approved", "rejected"]
const rejectionFlags: ReviewRejectionFlag[] = [
  "spam_or_fake",
  "abusive_or_harassing",
  "off_topic",
  "duplicate",
  "conflict_of_interest",
  "inappropriate_media",
  "other",
]

function formatFlag(flag?: ReviewRejectionFlag | null) {
  if (!flag) return "None"
  return flag.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function getFlagTone(flag?: ReviewRejectionFlag | null) {
  switch (flag) {
    case "abusive_or_harassing":
      return "bg-red-50 text-red-700 border-red-100"
    case "duplicate":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "conflict_of_interest":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "off_topic":
      return "bg-stone-100 text-stone-700 border-stone-200"
    case "inappropriate_media":
      return "bg-rose-50 text-rose-700 border-rose-100"
    case "spam_or_fake":
      return "bg-orange-50 text-orange-700 border-orange-100"
    case "other":
      return "bg-violet-50 text-violet-700 border-violet-100"
    default:
      return "bg-muted text-foreground border-border"
  }
}

function getModerationStatusTone(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return "bg-muted text-foreground border-border"
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-100"
  }
}

function formatStatus(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
  }
}

export function AdminReviewModerationPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [selectedDecision, setSelectedDecision] = useState<"approved" | "rejected">("approved")
  const [selectedRejectReason, setSelectedRejectReason] = useState<ReviewRejectionFlag>("spam_or_fake")
  const [moderationNote, setModerationNote] = useState("")

  const reviewsQuery = useAdminReviews({
    page: currentPage,
    perPage: pageSize,
    status: statusFilter === "all" ? "" : statusFilter,
    search: debouncedQuery,
  })
  const selectedReviewQuery = useAdminReview(selectedReviewId)
  const approveReview = useApproveAdminReview()
  const rejectReview = useRejectAdminReview()
  const deleteReview = useDeleteAdminReview()

  const selectedReview = selectedReviewQuery.data ?? null
  const reviewPendingDelete = useMemo(
    () => reviewsQuery.data?.items.find((review) => review.id === deleteReviewId) ?? (selectedReview?.id === deleteReviewId ? selectedReview : null),
    [deleteReviewId, reviewsQuery.data?.items, selectedReview],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter])

  useEffect(() => {
    if (!selectedReview) return
    if (selectedReview.status === "rejected") {
      setSelectedDecision("rejected")
      setSelectedRejectReason(selectedReview.rejectionFlag ?? "spam_or_fake")
      setModerationNote(selectedReview.moderationNote ?? "")
      return
    }
    setSelectedDecision("approved")
    setSelectedRejectReason("spam_or_fake")
    setModerationNote("")
  }, [selectedReview])

  const resultSummary =
    !reviewsQuery.data || reviewsQuery.data.meta.total === 0
      ? "No reviews match this view."
      : `Showing ${(reviewsQuery.data.meta.page - 1) * reviewsQuery.data.meta.perPage + 1}-${Math.min(reviewsQuery.data.meta.page * reviewsQuery.data.meta.perPage, reviewsQuery.data.meta.total)} of ${reviewsQuery.data.meta.total}`

  const columns = useMemo<AdminTableColumn<ReviewItem>[]>(
    () => [
      {
        id: "review",
        label: "Review",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (review) => (
          <div className="space-y-1">
            <p className="max-w-[24rem] text-sm font-semibold leading-6 text-foreground">{review.body.slice(0, 90)}{review.body.length > 90 ? "..." : ""}</p>
            <p className="text-sm text-muted-foreground">{review.rating}/5</p>
          </div>
        ),
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (review) => (
          <AdminStatusBadge label={formatStatus(review.status)} tone={getModerationStatusTone(review.status)} />
        ),
      },
      {
        id: "business",
        label: "Business",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm font-medium text-foreground",
        cell: (review) => review.businessName || "Unknown business",
      },
      {
        id: "reviewer",
        label: "Reviewer",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (review) => review.author.name,
      },
      {
        id: "flag",
        label: "Flag",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (review) => (
          <AdminStatusBadge label={formatFlag(review.rejectionFlag)} tone={getFlagTone(review.rejectionFlag)} />
        ),
      },
      {
        id: "submitted",
        label: "Submitted",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (review) => formatAdminDate(review.createdAt),
      },
      {
        id: "action",
        label: "Action",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (review) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => setSelectedReviewId(review.id),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => setDeleteReviewId(review.id),
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  async function applyModerationDecision() {
    if (!selectedReview) return

    try {
      if (selectedDecision === "approved") {
        await approveReview.mutateAsync(selectedReview.id)
        toast({ title: "Review approved" })
      } else {
        await rejectReview.mutateAsync({
          id: selectedReview.id,
          payload: {
            rejectionFlag: selectedRejectReason,
            moderationNote: moderationNote.trim() || undefined,
          },
        })
        toast({ title: "Review rejected" })
      }
      setSelectedReviewId(null)
    } catch (error) {
      toast({
        title: "Could not update review",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  async function confirmDeleteReview() {
    if (!reviewPendingDelete) return

    try {
      await deleteReview.mutateAsync(reviewPendingDelete.id)
      toast({ title: "Review deleted" })
      setDeleteReviewId(null)
      if (selectedReviewId === reviewPendingDelete.id) {
        setSelectedReviewId(null)
      }
    } catch (error) {
      toast({
        title: "Could not delete review",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Review Moderation</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Review Moderation</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Review customer submissions, check media, and decide what becomes visible on the public business pages.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={reviewsQuery.data?.items ?? []}
          rowKey={(review) => review.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search reviews, businesses, or reviewers"
          leftToolbarContent={
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | ReviewStatus)}>
                <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {reviewStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All" : formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          currentPage={reviewsQuery.data?.meta.page ?? currentPage}
          totalPages={reviewsQuery.data?.meta.totalPages ?? 1}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No reviews match this view."
          emptyDescription="Try clearing the search or switching the status filter."
          isLoading={reviewsQuery.isLoading}
        />
      </div>

      <AdminModal
        open={selectedReviewId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewId(null)
        }}
        title="Review moderation"
        description="Inspect the full review, then approve or reject it."
        confirmLabel={selectedDecision === "approved" ? "Approve review" : "Reject review"}
        cancelLabel="Close"
        onConfirm={selectedReview?.status === "pending" ? applyModerationDecision : undefined}
        size="lg"
        bodyClassName="space-y-6"
        isConfirmDisabled={selectedDecision === "rejected" && selectedRejectReason === "other" && !moderationNote.trim()}
        isLoading={approveReview.isPending || rejectReview.isPending}
        showFooter={Boolean(selectedReview)}
      >
        {selectedReview ? (
          <>
            <section className="space-y-4 border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <AdminStatusBadge label={formatFlag(selectedReview.rejectionFlag)} tone={getFlagTone(selectedReview.rejectionFlag)} />
                <AdminStatusBadge label={formatStatus(selectedReview.status)} tone={getModerationStatusTone(selectedReview.status)} />
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Business</p>
                  <p className="text-base font-semibold text-foreground">{selectedReview.businessName || "Unknown business"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Reviewer</p>
                  <p className="text-base font-semibold text-foreground">{selectedReview.author.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base font-semibold text-foreground">{formatAdminDate(selectedReview.createdAt)}</p>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-b border-border pb-5">
              <p className="text-sm font-medium text-muted-foreground">{selectedReview.rating}/5 rating</p>
              <p className="text-sm leading-7 text-foreground">{selectedReview.body}</p>
            </section>

            {selectedReview.media.length > 0 ? (
              <section className="space-y-3 border-b border-border pb-5">
                <p className="text-sm font-semibold text-foreground">Attached images</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedReview.media.map((media) => (
                    <a key={media.id} href={media.publicUrl} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-border bg-white">
                      <img src={media.publicUrl} alt={media.altText || media.filename} className="h-32 w-full object-cover" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            {selectedReview.status === "pending" ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Moderation decision</p>
                  <p className="mt-1 text-sm text-muted-foreground">Choose how this review should move forward.</p>
                </div>
                <RadioGroup value={selectedDecision} onValueChange={(value) => setSelectedDecision(value as "approved" | "rejected")} className="gap-3">
                  {[
                    { value: "approved", title: "Approve review", description: "Make the review visible on the public business page." },
                    { value: "rejected", title: "Reject review", description: "Keep the review off the public page and ask the reviewer to fix it." },
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
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Rejection reason</p>
                      <Select value={selectedRejectReason} onValueChange={(value) => setSelectedRejectReason(value as ReviewRejectionFlag)}>
                        <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                          <SelectValue placeholder="Choose a rejection reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {rejectionFlags.map((flag) => (
                            <SelectItem key={flag} value={flag}>
                              {formatFlag(flag)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Moderation note {selectedRejectReason === "other" ? "*" : ""}</p>
                      <textarea
                        value={moderationNote}
                        onChange={(event) => setModerationNote(event.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-[1rem] border border-brand-deep-green/10 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/12"
                        placeholder="Add a note for the reviewer."
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
                This review has already been moderated. You can still delete it from the queue.
              </div>
            )}
          </>
        ) : null}
      </AdminModal>

      <AdminConfirmModal
        open={reviewPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteReviewId(null)
        }}
        title="Delete this review?"
        description={
          reviewPendingDelete
            ? `This will remove the review from ${reviewPendingDelete.businessName || "the business"} and detach its media attachments.`
            : "This will remove the selected review."
        }
        confirmLabel="Delete review"
        onConfirm={confirmDeleteReview}
        isLoading={deleteReview.isPending}
      />
    </>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Trash2 } from "lucide-react"
import { AdminRowActions } from "@/components/admin/admin-row-actions"
import { AdminConfirmModal, AdminModal } from "@/components/admin/admin-modal"
import { AdminTable } from "@/components/admin/admin-table"
import { mockAdminReviewModeration, type AdminReviewModerationFlag, type AdminReviewModerationItem, type AdminReviewModerationStatus } from "@/components/admin/admin-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell } from "@/components/ui/table"

const pageSize = 6

function getFlagTone(flag: AdminReviewModerationFlag) {
  switch (flag) {
    case "Abusive wording":
      return "bg-red-50 text-red-700 border-red-100"
    case "Potential duplicate":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Owner dispute":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Off-topic content":
      return "bg-stone-100 text-stone-700 border-stone-200"
    case "Harassment":
      return "bg-rose-50 text-rose-700 border-rose-100"
  }
}

function getModerationStatusTone(status: AdminReviewModerationStatus) {
  switch (status) {
    case "Pending":
      return "bg-brand-soft-beige/80 text-brand-dark-green border-brand-deep-green/10"
    case "Accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-100"
  }
}

export function AdminReviewModerationPage() {
  const [query, setQuery] = useState("")
  const [reviews, setReviews] = useState(mockAdminReviewModeration)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [selectedDecision, setSelectedDecision] = useState<"Accepted" | "Rejected">("Accepted")
  const [selectedRejectReason, setSelectedRejectReason] = useState<AdminReviewModerationFlag>("Abusive wording")

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return reviews.filter((review) => {
      if (normalizedQuery.length === 0) return true

      return [
        review.businessName,
        review.reviewerName,
        review.reviewTitle,
        review.reviewSnippet,
        review.reviewBody,
        review.flagLabel,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [query, reviews])

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredReviews.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredReviews])

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? null,
    [reviews, selectedReviewId],
  )

  const reviewPendingDelete = useMemo(
    () => reviews.find((review) => review.id === deleteReviewId) ?? null,
    [reviews, deleteReviewId],
  )

  useEffect(() => {
    if (!selectedReview) return

    setSelectedDecision(selectedReview.moderationStatus === "Rejected" ? "Rejected" : "Accepted")
    setSelectedRejectReason(selectedReview.flagLabel)
  }, [selectedReview])

  const resultSummary =
    filteredReviews.length === 0
      ? "No flagged reviews match this search."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReviews.length)} of ${filteredReviews.length}`

  const columns = [
    { id: "review", label: "Review", className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "status", label: "Status", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "business", label: "Business", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "reviewer", label: "Reviewer", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "flag", label: "Flag", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "submitted", label: "Submitted", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "action", label: "Action", className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
  ]

  function applyModerationDecision() {
    if (!selectedReview) return

    setReviews((current) =>
      current.map((review) =>
        review.id === selectedReview.id
          ? {
              ...review,
              moderationStatus: selectedDecision,
              flagLabel: selectedDecision === "Rejected" ? selectedRejectReason : review.flagLabel,
            }
          : review,
      ),
    )
    setSelectedReviewId(null)
  }

  function confirmDeleteReview() {
    if (!reviewPendingDelete) return

    setReviews((current) => current.filter((review) => review.id !== reviewPendingDelete.id))
    setDeleteReviewId(null)
    if (selectedReviewId === reviewPendingDelete.id) {
      setSelectedReviewId(null)
    }
  }

  function renderReviewRow(review: AdminReviewModerationItem) {
    return (
      <>
        <TableCell className="px-6 py-5 align-top">
          <div className="space-y-1">
            <p className="max-w-[24rem] text-sm font-semibold leading-6 text-brand-dark-green">{review.reviewTitle}</p>
            <p className="text-sm text-muted-foreground">{review.rating}/5</p>
          </div>
        </TableCell>
        <TableCell className="py-5 align-top">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getModerationStatusTone(review.moderationStatus)}`}>
            {review.moderationStatus}
          </span>
        </TableCell>
        <TableCell className="py-5 align-top text-sm font-medium text-brand-dark-green">{review.businessName}</TableCell>
        <TableCell className="py-5 align-top text-sm text-muted-foreground">{review.reviewerName}</TableCell>
        <TableCell className="py-5 align-top">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getFlagTone(review.flagLabel)}`}>
            {review.flagLabel}
          </span>
        </TableCell>
        <TableCell className="py-5 align-top text-sm text-muted-foreground">{review.submittedAt}</TableCell>
        <TableCell className="py-5 pr-6 align-top text-right">
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
        </TableCell>
      </>
    )
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
              Triage flagged reviews quickly, check the full context, and apply moderation decisions without leaving the queue.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={paginatedReviews}
          rowKey={(review) => review.id}
          renderRow={renderReviewRow}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search flagged reviews, businesses, or reviewers"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No flagged reviews match this view."
          emptyDescription="Try clearing the search to bring flagged items back into the queue."
        />
      </div>

      <AdminModal
        open={selectedReview !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewId(null)
        }}
        title="Review moderation"
        description="Inspect the full review, then accept or reject it from the queue."
        confirmLabel="Save"
        cancelLabel="Close"
        onConfirm={applyModerationDecision}
        size="lg"
        bodyClassName="space-y-6"
      >
        {selectedReview ? (
          <>
            <section className="space-y-4 border-b border-brand-deep-green/10 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getFlagTone(selectedReview.flagLabel)}`}>
                  {selectedReview.flagLabel}
                </span>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getModerationStatusTone(selectedReview.moderationStatus)}`}>
                  {selectedReview.moderationStatus}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Business</p>
                  <p className="text-base font-semibold text-brand-dark-green">{selectedReview.businessName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Reviewer</p>
                  <p className="text-base font-semibold text-brand-dark-green">{selectedReview.reviewerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Submitted</p>
                  <p className="text-base font-semibold text-brand-dark-green">{selectedReview.submittedAt}</p>
                </div>
              </div>
            </section>

            <section className="space-y-3 border-b border-brand-deep-green/10 pb-5">
              <p className="text-sm font-medium text-muted-foreground">{selectedReview.rating}/5 rating</p>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-brand-dark-green">{selectedReview.reviewTitle}</h3>
                <p className="text-sm leading-7 text-brand-dark-green">{selectedReview.reviewBody}</p>
              </div>
            </section>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-brand-dark-green">Moderation decision</p>
                <p className="mt-1 text-sm text-muted-foreground">Choose how this review should move forward in the queue.</p>
              </div>
              <RadioGroup value={selectedDecision} onValueChange={(value) => setSelectedDecision(value as "Accepted" | "Rejected")} className="gap-3">
                {[
                  { value: "Accepted", title: "Accept review", description: "Keep the review live and clear it from moderation." },
                  { value: "Rejected", title: "Reject review", description: "Remove the review from the public experience after moderation." },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-[1.2rem] border border-brand-deep-green/10 bg-white px-4 py-4 transition-colors hover:bg-brand-soft-beige/18"
                  >
                    <RadioGroupItem value={option.value} className="mt-1" />
                    <span className="space-y-1">
                      <span className="block text-sm font-semibold text-brand-dark-green">{option.title}</span>
                      <span className="block text-sm leading-6 text-muted-foreground">{option.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {selectedDecision === "Rejected" ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-dark-green">Rejection reason</p>
                  <Select value={selectedRejectReason} onValueChange={(value) => setSelectedRejectReason(value as AdminReviewModerationFlag)}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Choose a rejection reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Abusive wording", "Potential duplicate", "Owner dispute", "Off-topic content", "Harassment"] as AdminReviewModerationFlag[]).map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </AdminModal>

      <AdminConfirmModal
        open={reviewPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteReviewId(null)
        }}
        title="Delete this flagged review?"
        description={
          reviewPendingDelete
            ? `This will remove the review from the moderation queue for ${reviewPendingDelete.businessName}.`
            : "This will remove the selected review from the moderation queue."
        }
        confirmLabel="Delete review"
        onConfirm={confirmDeleteReview}
      />
    </>
  )
}

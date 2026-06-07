"use client"

import { useEffect, useMemo, useState, type ComponentProps } from "react"
import Link from "next/link"
import { CheckCircle2, ChevronRight, Download, Eye, XCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminBusinessLocation, getAdminBusinessPublicHref } from "@/features/admin/utils/admin-business-utils"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  useAdminBusinessClaim,
  useAdminBusinessClaims,
  useApproveBusinessClaim,
  useRejectBusinessClaim,
} from "@/hooks/use-business-claims"
import { getClaimDocumentDownloadUrl } from "@/lib/api/business-claims"
import { useToast } from "@/hooks/use-toast"
import type { BusinessClaim, BusinessClaimStatus, BusinessClaimStatusFilter } from "@/types/business-claims"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const pageSize = 10

const statusOptions: Array<{ label: string; value: BusinessClaimStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
]

function parseStatusFilter(value: string | null): BusinessClaimStatusFilter {
  if (value === "all" || value === "pending" || value === "approved" || value === "rejected") return value
  return "pending"
}

function statusLabel(status: BusinessClaimStatus) {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
  }
}

function statusTone(status: BusinessClaimStatus) {
  switch (status) {
    case "pending":
      return "border-amber-100 bg-amber-50 text-amber-700"
    case "approved":
      return "border-emerald-100 bg-emerald-50 text-emerald-700"
    case "rejected":
      return "border-red-100 bg-red-50 text-red-700"
  }
}

export function AdminBusinessClaimsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const queryBusinessId = searchParams.get("businessId") ?? undefined
  const queryClaimId = searchParams.get("claimId")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<BusinessClaimStatusFilter>(() => parseStatusFilter(searchParams.get("status")))
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [approveClaimId, setApproveClaimId] = useState<string | null>(null)
  const [rejectClaimId, setRejectClaimId] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)

  const params = useMemo(
    () => ({
      status: statusFilter,
      search: debouncedQuery.trim() || undefined,
      businessId: queryBusinessId,
      page: currentPage,
      perPage: pageSize,
    }),
    [currentPage, debouncedQuery, queryBusinessId, statusFilter],
  )

  const claimsResult = useAdminBusinessClaims(params)
  const selectedClaimResult = useAdminBusinessClaim(selectedClaimId)
  const approveClaim = useApproveBusinessClaim()
  const rejectClaim = useRejectBusinessClaim()

  const listData = claimsResult.data
  const claims = listData?.items ?? []
  const totalPages = Math.max(1, listData?.meta.totalPages ?? 1)
  const total = listData?.meta.total ?? 0
  const selectedClaim = selectedClaimResult.data ?? claims.find((claim) => claim.id === selectedClaimId) ?? null

  useEffect(() => {
    setCurrentPage(1)
  }, [query, queryBusinessId, statusFilter])

  useEffect(() => {
    if (queryClaimId) setSelectedClaimId(queryClaimId)
  }, [queryClaimId])

  async function openDocument(claimId: string, mediaId: string) {
    try {
      const access = await getClaimDocumentDownloadUrl(claimId, mediaId)
      window.open(access.url, "_blank", "noopener,noreferrer")
    } catch {
      toast({ title: "Could not open document", description: "Please try again.", variant: "destructive" })
    }
  }

  async function handleApprove() {
    if (!approveClaimId) return
    await approveClaim.mutateAsync(
      { id: approveClaimId, payload: { reviewNote: reviewNote.trim() || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Claim approved", description: "The claimant now has owner access." })
          setApproveClaimId(null)
          setReviewNote("")
        },
        onError: () => {
          toast({ title: "Could not approve claim", description: "Please try again.", variant: "destructive" })
        },
      },
    )
  }

  async function handleReject() {
    if (!rejectClaimId) return
    if (!reviewNote.trim()) {
      toast({ title: "Rejection reason required", description: "Add a short reason before rejecting this claim.", variant: "destructive" })
      return
    }
    await rejectClaim.mutateAsync(
      { id: rejectClaimId, payload: { reviewNote: reviewNote.trim() || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Claim rejected", description: "The business is available to claim again if no pending claims remain." })
          setRejectClaimId(null)
          setReviewNote("")
        },
        onError: () => {
          toast({ title: "Could not reject claim", description: "Please try again.", variant: "destructive" })
        },
      },
    )
  }

  const columns = useMemo<AdminTableColumn<BusinessClaim>[]>(
    () => [
      {
        id: "business",
        label: "Business",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (claim) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">{claim.business?.name ?? claim.businessId}</p>
            <p className="text-xs text-muted-foreground">{formatAdminBusinessLocation(claim.business)}</p>
          </div>
        ),
      },
      {
        id: "claimant",
        label: "Claimant",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (claim) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">{claim.claimantName || claim.user?.name || "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{claim.user?.email ?? claim.businessEmail}</p>
          </div>
        ),
      },
      {
        id: "status",
        label: "Status",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (claim) => (
          <AdminStatusBadge label={statusLabel(claim.status)} tone={statusTone(claim.status)} />
        ),
      },
      {
        id: "submitted",
        label: "Submitted",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (claim) => formatAdminDateTime(claim.createdAt),
      },
      {
        id: "actions",
        label: "Actions",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
        cell: (claim) => {
          const items: ComponentProps<typeof AdminRowActions>["items"] = [
            {
              label: "Review",
              icon: <Eye className="h-4 w-4" />,
              onSelect: () => setSelectedClaimId(claim.id),
            },
          ]

          if (claim.status === "pending") {
            items.push(
              {
                label: "Approve",
                icon: <CheckCircle2 className="h-4 w-4" />,
                onSelect: () => {
                  setApproveClaimId(claim.id)
                  setReviewNote("")
                },
              },
              {
                label: "Reject",
                icon: <XCircle className="h-4 w-4" />,
                onSelect: () => {
                  setRejectClaimId(claim.id)
                  setReviewNote("")
                },
                variant: "destructive",
              },
            )
          }

          return (
            <div className="flex justify-end">
              <AdminRowActions items={items} />
            </div>
          )
        },
      },
    ],
    [],
  )

  const resultSummary =
    total === 0
      ? "No business claims match this view."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} of ${total}`

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Business claims</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Business claims</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Review ownership requests, private verification documents, and approve or reject business dashboard access.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={claims}
          rowKey={(claim) => claim.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search by business, claimant, or email"
          leftToolbarContent={
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BusinessClaimStatusFilter)}>
                <SelectTrigger className="h-11 w-[180px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No business claims found"
          emptyDescription={claimsResult.isPending ? "Loading claims..." : "Try changing the search or status filter."}
        />
      </div>

      <AdminModal
        open={selectedClaimId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedClaimId(null)
        }}
        title="Review business claim"
        description="Check claimant details and private verification documents before deciding."
        showFooter={false}
        size="2xl"
      >
        {selectedClaim ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <ReviewBlock label="Business" value={selectedClaim.business?.name ?? selectedClaim.businessId} helper={formatAdminBusinessLocation(selectedClaim.business)} />
              <ReviewBlock label="Submitted by" value={selectedClaim.claimantName || selectedClaim.user?.name || "Unknown"} helper={selectedClaim.user?.email} />
              <ReviewBlock label="Role" value={selectedClaim.role.replaceAll("-", " ")} />
              <ReviewBlock label="PAN/VAT" value={selectedClaim.panVatNumber} />
              <ReviewBlock label="Business phone" value={selectedClaim.businessPhone} />
              <ReviewBlock label="Business email" value={selectedClaim.businessEmail} />
            </div>

            {selectedClaim.note ? (
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Claimant note</p>
                <p className="mt-2 text-sm leading-6 text-brand-dark-green">{selectedClaim.note}</p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-brand-deep-green/10 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Documents</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {selectedClaim.status !== "pending" && selectedClaim.documentsDeletedAt ? (
                  <p className="text-sm text-muted-foreground">
                    Documents deleted after review on {formatAdminDateTime(selectedClaim.documentsDeletedAt)}.
                  </p>
                ) : selectedClaim.status === "pending" && (selectedClaim.documents ?? []).length > 0 ? (
                  selectedClaim.documents?.map((document) => (
                    <Button
                      key={document.id}
                      type="button"
                      variant="outline"
                      className="rounded-xl border-brand-deep-green/14"
                      onClick={() => openDocument(selectedClaim.id, document.id)}
                    >
                      <Download className="h-4 w-4" />
                      {document.filename}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No private documents attached.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl border-brand-deep-green/14" asChild>
                <Link href={getAdminBusinessPublicHref(selectedClaim.business ?? { slug: selectedClaim.businessId })} target="_blank">
                  Open public page
                </Link>
              </Button>
              {selectedClaim.status === "pending" ? (
                <>
                  <Button
                    className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      setApproveClaimId(selectedClaim.id)
                      setReviewNote("")
                    }}
                  >
                    Approve claim
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl"
                    onClick={() => {
                      setRejectClaimId(selectedClaim.id)
                      setReviewNote("")
                    }}
                  >
                    Reject claim
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading claim details...</p>
        )}
      </AdminModal>

      <DecisionModal
        open={approveClaimId !== null}
        onOpenChange={(open) => {
          if (!open) setApproveClaimId(null)
        }}
        title="Approve business claim"
        description="This grants the claimant owner access and marks the business as claimed."
        confirmLabel="Approve claim"
        reviewNote={reviewNote}
        setReviewNote={setReviewNote}
        onConfirm={handleApprove}
        isLoading={approveClaim.isPending}
      />

      <DecisionModal
        open={rejectClaimId !== null}
        onOpenChange={(open) => {
          if (!open) setRejectClaimId(null)
        }}
        title="Reject business claim"
        description="This rejects the request. If no other pending claims remain, the listing becomes claimable again."
        confirmLabel="Reject claim"
        reviewNote={reviewNote}
        setReviewNote={setReviewNote}
        onConfirm={handleReject}
        isLoading={rejectClaim.isPending}
        destructive
        requiresNote
      />
    </>
  )
}

function ReviewBlock({ label, value, helper }: { label: string; value?: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{label}</p>
      <p className="mt-2 text-sm font-semibold capitalize text-brand-dark-green">{value || "Not provided"}</p>
      {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  )
}

function DecisionModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  reviewNote,
  setReviewNote,
  onConfirm,
  isLoading,
  destructive = false,
  requiresNote = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  reviewNote: string
  setReviewNote: (value: string) => void
  onConfirm: () => void
  isLoading: boolean
  destructive?: boolean
  requiresNote?: boolean
}) {
  const noteIsMissing = requiresNote && reviewNote.trim().length === 0

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      confirmVariant={destructive ? "destructive" : "default"}
      onConfirm={onConfirm}
      isConfirmDisabled={noteIsMissing}
      isLoading={isLoading}
      size="md"
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-dark-green" htmlFor="claim-review-note">
          {requiresNote ? "Rejection reason" : "Review note"}
        </label>
        <Textarea
          id="claim-review-note"
          value={reviewNote}
          onChange={(event) => setReviewNote(event.target.value)}
          placeholder={requiresNote ? "Explain why this claim is being rejected" : "Optional note for internal review history"}
          className="min-h-28 rounded-xl border-brand-deep-green/10 bg-white shadow-none"
        />
        {requiresNote ? (
          <p className="text-xs text-muted-foreground">Required for claimant communication and internal history.</p>
        ) : null}
      </div>
    </AdminModal>
  )
}

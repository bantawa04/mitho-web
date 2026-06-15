"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Eye, Link2, MapPinned } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminConfirmModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  formatDuplicateHintSummary,
  formatPlaceImportBatchBias,
  formatPlaceImportCandidateLocation,
  getPlaceImportAddressPresentation,
  getPlaceImportBatchStatusPresentation,
  getPlaceImportDuplicatePresentation,
  getPlaceImportStatusPresentation,
} from "@/features/admin/utils/admin-place-import-utils"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  useImportPlaceImportCandidate,
  useMatchPlaceImportCandidate,
  usePlaceImportBatch,
  usePlaceImportCandidates,
  useRejectPlaceImportCandidate,
} from "@/hooks/use-place-import"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { PlaceImportCandidate, PlaceImportDuplicateStatus, PlaceImportStatus } from "@/types/place-import"

const pageSize = 10

type ImportStatusFilter = "all" | PlaceImportStatus
type DuplicateStatusFilter = "all" | PlaceImportDuplicateStatus

const importStatusOptions: Array<{ label: string; value: ImportStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Imported", value: "imported" },
  { label: "Rejected", value: "rejected" },
]

const duplicateStatusOptions: Array<{ label: string; value: DuplicateStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Warning", value: "warning" },
  { label: "Linked", value: "matched" },
  { label: "Clear", value: "clear" },
]

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-brand-dark-green"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function AdminPlaceImportBatchPage({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<ImportStatusFilter>("all")
  const [duplicateFilter, setDuplicateFilter] = useState<DuplicateStatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [candidatePendingOverride, setCandidatePendingOverride] = useState<PlaceImportCandidate | null>(null)
  const [candidatePendingReject, setCandidatePendingReject] = useState<PlaceImportCandidate | null>(null)

  const batchQuery = usePlaceImportBatch(id)
  const candidatesQuery = usePlaceImportCandidates({
    batchId: id,
    status: statusFilter,
    duplicateStatus: duplicateFilter,
    search: debouncedQuery.trim() || undefined,
  })
  const importCandidate = useImportPlaceImportCandidate()
  const rejectCandidate = useRejectPlaceImportCandidate()
  const matchCandidate = useMatchPlaceImportCandidate()

  const candidates = candidatesQuery.data ?? []
  const batch = batchQuery.data

  const totalPages = Math.max(1, Math.ceil(candidates.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter, duplicateFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return candidates.slice(startIndex, startIndex + pageSize)
  }, [candidates, currentPage])

  async function handleQuickLink(candidate: PlaceImportCandidate) {
    const firstHint = candidate.duplicateHints[0]
    if (!firstHint) return

    try {
      await matchCandidate.mutateAsync({
        id: candidate.id,
        payload: {
          businessId: firstHint.id,
          note: `Linked from batch review to ${firstHint.name}`,
        },
      })
      toast({
        title: "Candidate linked",
        description: `${candidate.name} is now linked to ${firstHint.name}.`,
      })
    } catch (error) {
      toast({
        title: "Could not link business",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  async function handleImport(candidate: PlaceImportCandidate, forceDuplicateOverride = false) {
    try {
      const result = await importCandidate.mutateAsync({
        id: candidate.id,
        payload: { forceDuplicateOverride },
      })

      toast({
        title: result.matchedBusiness ? "Existing business linked" : "Business imported",
        description: `${candidate.name} is ready in the businesses directory.`,
      })

      const businessId = result.importedBusiness?.id ?? result.matchedBusiness?.id
      if (businessId) router.push(`/admin/businesses/${businessId}`)
    } catch (error) {
      const message = extractApiErrorMessage(error)
      if (message.toLowerCase().includes("duplicate")) {
        setCandidatePendingOverride(candidate)
        return
      }
      toast({
        title: "Could not import candidate",
        description: message,
        variant: "destructive",
      })
    }
  }

  async function handleReject(candidate: PlaceImportCandidate) {
    try {
      await rejectCandidate.mutateAsync({
        id: candidate.id,
      })
      toast({
        title: "Candidate rejected",
        description: `${candidate.name} will stay out of the import queue.`,
      })
      setCandidatePendingReject(null)
    } catch (error) {
      toast({
        title: "Could not reject candidate",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  const columns = useMemo<AdminTableColumn<PlaceImportCandidate>[]>(
    () => [
      {
        id: "candidate",
        label: "Candidate",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-3 align-top",
        cell: (candidate) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
            <p className="text-xs text-muted-foreground">{candidate.phone || candidate.raw.phone || "No phone captured"}</p>
          </div>
        ),
      },
      {
        id: "location",
        label: "Mitho Address",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top text-sm text-muted-foreground",
        cell: (candidate) => formatPlaceImportCandidateLocation(candidate) || candidate.formattedAddress || "Needs address review",
      },
      {
        id: "status",
        label: "Review Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top",
        cell: (candidate) => (
          <div className="flex flex-col items-start gap-2">
            <AdminStatusBadge {...getPlaceImportStatusPresentation(candidate.importStatus)} />
            <AdminStatusBadge {...getPlaceImportDuplicatePresentation(candidate.duplicateCheckStatus)} />
            <AdminStatusBadge {...getPlaceImportAddressPresentation(candidate.addressReviewStatus)} />
          </div>
        ),
      },
      {
        id: "duplicates",
        label: "Likely Match",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top",
        cell: (candidate) => {
          if (candidate.importedBusiness) {
            return (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{candidate.importedBusiness.name}</p>
                <p className="text-xs text-muted-foreground">Imported destination</p>
              </div>
            )
          }

          if (candidate.matchedBusiness) {
            return (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{candidate.matchedBusiness.name}</p>
                <p className="text-xs text-muted-foreground">Linked existing business</p>
              </div>
            )
          }

          const firstHint = candidate.duplicateHints[0]
          if (!firstHint) {
            return <p className="text-sm text-muted-foreground">No likely matches</p>
          }

          return (
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{firstHint.name}</p>
                <p className="text-xs text-muted-foreground">{formatDuplicateHintSummary(candidate)}</p>
              </div>
              <button
                type="button"
                className="text-xs font-medium text-brand-dark-green underline-offset-4 hover:underline"
                onClick={() => handleQuickLink(candidate)}
                disabled={matchCandidate.isPending}
              >
                Link first match
              </button>
            </div>
          )
        },
      },
      {
        id: "actions",
        label: "Actions",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 pr-6 align-top text-right",
        cell: (candidate) => {
          const items: Parameters<typeof AdminRowActions>[0]["items"] = [
            {
              label: "Open Editor",
              icon: <Eye className="h-4 w-4" />,
              onSelect: () => router.push(`/admin/imports/candidates/${candidate.id}`),
            },
          ]

          if (candidate.importStatus !== "imported") {
            items.push({
              label: "Import",
              icon: <MapPinned className="h-4 w-4" />,
              onSelect: () => handleImport(candidate),
            })
          }

          if (candidate.importStatus === "pending") {
            items.push({
              label: "Reject",
              icon: <Link2 className="h-4 w-4" />,
              onSelect: () => setCandidatePendingReject(candidate),
              variant: "destructive" as const,
            })
          }

          return (
            <div className="flex justify-end">
              <AdminRowActions items={items} />
            </div>
          )
        },
      },
    ],
    [handleImport, handleQuickLink, importCandidate.isPending, matchCandidate.isPending, router],
  )

  const resultSummary =
    candidates.length === 0
      ? "No candidates match the current filters."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, candidates.length)} of ${candidates.length}`

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/admin/imports" className="transition-colors hover:text-brand-dark-green">
              Imports
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Batch</span>
          </div>

          {batch ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">{batch.query}</h1>
                <AdminStatusBadge {...getPlaceImportBatchStatusPresentation(batch.status)} size="md" />
              </div>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {batch.fetchedCount} Google places captured · {formatPlaceImportBatchBias(batch)} · created {formatAdminDateTime(batch.createdAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Batch details</h1>
              <p className="text-sm text-muted-foreground">Loading import batch…</p>
            </div>
          )}
        </section>

        <AdminTable
          columns={columns}
          data={paginatedCandidates}
          rowKey={(candidate) => candidate.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search candidates by name or address"
          leftToolbarContent={
            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as ImportStatusFilter)}
                options={importStatusOptions}
              />
              <FilterSelect
                label="Duplicates"
                value={duplicateFilter}
                onChange={(value) => setDuplicateFilter(value as DuplicateStatusFilter)}
                options={duplicateStatusOptions}
              />
            </div>
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No candidates found"
          emptyDescription="Try a different search term or reset the filters for this batch."
          isLoading={batchQuery.isLoading || candidatesQuery.isLoading}
        />
      </div>

      <AdminConfirmModal
        open={Boolean(candidatePendingOverride)}
        onOpenChange={(open) => {
          if (!open) setCandidatePendingOverride(null)
        }}
        title="Import despite duplicate warning?"
        description={`"${candidatePendingOverride?.name ?? "This candidate"}" has likely matches in Mitho. Continue only if you are sure this should create a new listing.`}
        confirmLabel="Import anyway"
        onConfirm={() => {
          if (!candidatePendingOverride) return
          void handleImport(candidatePendingOverride, true).finally(() => setCandidatePendingOverride(null))
        }}
        isLoading={importCandidate.isPending}
      />

      <AdminConfirmModal
        open={Boolean(candidatePendingReject)}
        onOpenChange={(open) => {
          if (!open) setCandidatePendingReject(null)
        }}
        title="Reject this candidate?"
        description={`"${candidatePendingReject?.name ?? "This candidate"}" will be removed from the pending import queue.`}
        confirmLabel="Reject candidate"
        onConfirm={() => {
          if (!candidatePendingReject) return
          void handleReject(candidatePendingReject)
        }}
        isLoading={rejectCandidate.isPending}
      />
    </>
  )
}

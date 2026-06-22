"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink, Eye } from "lucide-react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import {
  useAdminBusinessReport,
  useAdminBusinessReports,
  useRejectAdminBusinessReport,
  useResolveAdminBusinessReport,
} from "@/hooks/use-business-reports"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { BusinessInformationReport, BusinessReportReason, BusinessReportStatus } from "@/types/business-reports"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const statuses: Array<"all" | BusinessReportStatus> = ["all", "pending", "resolved", "rejected"]
const reasons: Array<"all" | BusinessReportReason> = [
  "all",
  "phone",
  "address",
  "hours",
  "website_social",
  "business_closed",
  "duplicate",
  "wrong_photos",
  "other",
]

function formatReason(reason: BusinessReportReason) {
  switch (reason) {
    case "phone":
      return "Phone number"
    case "address":
      return "Address or location"
    case "hours":
      return "Opening hours"
    case "website_social":
      return "Website or social"
    case "business_closed":
      return "Business closed"
    case "duplicate":
      return "Duplicate listing"
    case "wrong_photos":
      return "Wrong photos"
    case "other":
      return "Other"
  }
}

function formatStatus(status: BusinessReportStatus) {
  switch (status) {
    case "pending":
      return "Pending"
    case "resolved":
      return "Resolved"
    case "rejected":
      return "Rejected"
  }
}

function getStatusTone(status: BusinessReportStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-100"
  }
}

function reporterLabel(report: BusinessInformationReport) {
  if (report.reporter?.name) return report.reporter.name
  if (report.reporterEmail) return report.reporterEmail
  return "Anonymous"
}

export function AdminReportedContentPage() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<"all" | BusinessReportStatus>("pending")
  const [reasonFilter, setReasonFilter] = useState<"all" | BusinessReportReason>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedDecision, setSelectedDecision] = useState<"resolved" | "rejected">("resolved")
  const [resolutionNote, setResolutionNote] = useState("")

  const reportsQuery = useAdminBusinessReports({
    page: currentPage,
    perPage: pageSize,
    status: statusFilter === "all" ? "" : statusFilter,
    reason: reasonFilter === "all" ? "" : reasonFilter,
    search: debouncedQuery,
  })
  const selectedReportQuery = useAdminBusinessReport(selectedReportId)
  const resolveReport = useResolveAdminBusinessReport()
  const rejectReport = useRejectAdminBusinessReport()
  const selectedReport = selectedReportQuery.data ?? null

  const resultSummary =
    !reportsQuery.data || reportsQuery.data.meta.total === 0
      ? "No reports match this view."
      : `Showing ${(reportsQuery.data.meta.page - 1) * reportsQuery.data.meta.perPage + 1}-${Math.min(reportsQuery.data.meta.page * reportsQuery.data.meta.perPage, reportsQuery.data.meta.total)} of ${reportsQuery.data.meta.total}`

  const columns = useMemo<AdminTableColumn<BusinessInformationReport>[]>(
    () => [
      {
        id: "report",
        label: "Report",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (report) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{formatReason(report.reason)}</p>
            <p className="max-w-[22rem] text-sm leading-6 text-muted-foreground">
              {(report.suggestedCorrection || report.note || "No detail provided").slice(0, 110)}
              {(report.suggestedCorrection || report.note || "").length > 110 ? "..." : ""}
            </p>
          </div>
        ),
      },
      {
        id: "business",
        label: "Business",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm font-medium text-foreground",
        cell: (report) => report.business.name || "Unknown business",
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (report) => <AdminStatusBadge label={formatStatus(report.status)} tone={getStatusTone(report.status)} />,
      },
      {
        id: "reporter",
        label: "Reporter",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: reporterLabel,
      },
      {
        id: "submitted",
        label: "Submitted",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (report) => formatAdminDate(report.createdAt),
      },
      {
        id: "action",
        label: "Action",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (report) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "Review",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => {
                    setSelectedDecision("resolved")
                    setResolutionNote("")
                    setSelectedReportId(report.id)
                  },
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
    if (!selectedReport) return
    try {
      const payload = { resolutionNote: resolutionNote.trim() }
      if (selectedDecision === "resolved") {
        await resolveReport.mutateAsync({ id: selectedReport.id, payload })
        toast({ title: "Report resolved" })
      } else {
        await rejectReport.mutateAsync({ id: selectedReport.id, payload })
        toast({ title: "Report rejected" })
      }
      setSelectedReportId(null)
    } catch (error) {
      toast({
        title: "Could not update report",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  const isPendingReport = selectedReport?.status === "pending"
  const decisionValue = isPendingReport
    ? selectedDecision
    : selectedReport?.status === "rejected"
      ? "rejected"
      : "resolved"
  const resolutionNoteValue = isPendingReport ? resolutionNote : selectedReport?.resolutionNote ?? ""

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Reported Content</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Reported Content</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Review incorrect-information reports and update listings through the normal business edit flow.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={reportsQuery.data?.items ?? []}
          rowKey={(item) => item.id}
          searchValue={query}
          onSearchChange={(value) => {
            setQuery(value)
            setCurrentPage(1)
          }}
          searchPlaceholder="Search businesses, reports, or reporters"
          leftToolbarContent={
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as "all" | BusinessReportStatus)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-[150px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All" : formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-sm font-medium text-muted-foreground">Reason</span>
              <Select
                value={reasonFilter}
                onValueChange={(value) => {
                  setReasonFilter(value as "all" | BusinessReportReason)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason === "all" ? "All" : formatReason(reason)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          currentPage={reportsQuery.data?.meta.page ?? currentPage}
          totalPages={reportsQuery.data?.meta.totalPages ?? 1}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          resultSummary={resultSummary}
          emptyTitle="No reports match this view."
          emptyDescription="Try clearing the search or switching filters."
          isLoading={reportsQuery.isLoading}
        />
      </div>

      <AdminModal
        open={selectedReportId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReportId(null)
        }}
        title="Review report"
        description="Inspect the report, update the business if needed, then record the moderation decision."
        confirmLabel={selectedDecision === "resolved" ? "Mark resolved" : "Reject report"}
        cancelLabel="Close"
        onConfirm={applyDecision}
        confirmVariant={selectedDecision === "rejected" ? "destructive" : "default"}
        isConfirmDisabled={!isPendingReport || !resolutionNote.trim()}
        isLoading={resolveReport.isPending || rejectReport.isPending}
        showFooter={Boolean(selectedReport)}
        size="xl"
        bodyClassName="space-y-6"
      >
        {selectedReport ? (
          <>
            <section className="space-y-4 border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <AdminStatusBadge label={formatStatus(selectedReport.status)} tone={getStatusTone(selectedReport.status)} />
                <AdminStatusBadge label={formatReason(selectedReport.reason)} tone="bg-muted text-foreground border-border" />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Business</p>
                  <p className="text-base font-semibold text-foreground">{selectedReport.business.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Reporter</p>
                  <p className="text-base font-semibold text-foreground">{reporterLabel(selectedReport)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base font-semibold text-foreground">{formatAdminDate(selectedReport.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/businesses/${selectedReport.businessId}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark-green hover:underline"
                >
                  View business
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/businesses/${selectedReport.businessId}/edit`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:underline"
                >
                  Edit business
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <section className="grid gap-5 border-b border-border pb-5 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Suggested correction</p>
                <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  {selectedReport.suggestedCorrection || "No suggested correction provided."}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Additional note</p>
                <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  {selectedReport.note || "No additional note provided."}
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Decision</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isPendingReport
                    ? "Resolve after the listing is reviewed or corrected. Reject if no change is needed."
                    : `This report was ${formatStatus(selectedReport.status).toLowerCase()}.`}
                </p>
              </div>
              <RadioGroup
                value={decisionValue}
                onValueChange={(value) => setSelectedDecision(value as "resolved" | "rejected")}
                className="gap-3"
                disabled={!isPendingReport}
              >
                {[
                  { value: "resolved", title: "Resolved", description: "The report was valid or handled through the business edit flow." },
                  { value: "rejected", title: "Rejected", description: "The report was not actionable or no listing change is needed." },
                ].map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white px-4 py-4">
                    <RadioGroupItem value={option.value} className="mt-1" />
                    <span className="space-y-1">
                      <span className="block text-sm font-semibold text-foreground">{option.title}</span>
                      <span className="block text-sm leading-6 text-muted-foreground">{option.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Operator note *</p>
                <Textarea
                  value={resolutionNoteValue}
                  onChange={(event) => setResolutionNote(event.target.value)}
                  disabled={!isPendingReport}
                  rows={4}
                  className="resize-none rounded-xl"
                  placeholder="Summarize what was checked or changed."
                />
              </div>
            </section>
          </>
        ) : selectedReportQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading report...</p>
        ) : null}
      </AdminModal>
    </>
  )
}

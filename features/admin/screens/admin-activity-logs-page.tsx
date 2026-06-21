"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { useAdminActivityLogs } from "@/hooks/use-admin-activity-logs"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  adminActivityLogScopeOptions,
  type AdminActivityLogItem,
  type AdminActivityLogScope,
} from "@/types/admin-activity-logs"

function getScopeTone(scope: AdminActivityLogScope) {
  switch (scope) {
    case "Businesses":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Reviews":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Users":
      return "bg-sky-50 text-sky-700 border-sky-100"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function AdminActivityLogsPage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [scopeFilter, setScopeFilter] = useState<"All" | AdminActivityLogScope>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)

  const activityLogsResult = useAdminActivityLogs({
    page: currentPage,
    per_page: pageSize,
    scope: scopeFilter === "All" ? undefined : scopeFilter,
    search: debouncedQuery.trim() || undefined,
  })

  const logs = activityLogsResult.data?.items ?? []
  const totalPages = activityLogsResult.data?.meta.totalPages ?? 1

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, scopeFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const resultSummary = useMemo(() => {
    if (activityLogsResult.isError) return "Could not load activity logs."
    const total = activityLogsResult.data?.meta.total ?? 0
    if (total === 0) {
      return "No activity logs match this view."
    }
    const page = activityLogsResult.data?.meta.page ?? currentPage
    const start = (page - 1) * pageSize + 1
    const end = Math.min(start + logs.length - 1, total)
    return `Showing ${start}-${end} of ${total}`
  }, [
    currentPage,
    pageSize,
    logs.length,
    activityLogsResult.data?.meta.page,
    activityLogsResult.data?.meta.total,
    activityLogsResult.isError,
  ])

  const columns = useMemo<AdminTableColumn<AdminActivityLogItem>[]>(
    () => [
      {
        id: "actor",
        label: "Actor",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (log) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{log.actorName}</p>
            <p className="text-sm text-muted-foreground">{log.actorRole}</p>
          </div>
        ),
      },
      {
        id: "action",
        label: "Action",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (log) => (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">{log.actionLabel}</p>
            <p className="text-sm leading-6 text-muted-foreground">{log.summary}</p>
          </div>
        ),
      },
      {
        id: "target",
        label: "Target",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (log) => (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{log.targetLabel}</p>
            <AdminStatusBadge label={log.scope} tone={getScopeTone(log.scope)} />
          </div>
        ),
      },
      {
        id: "occurred-at",
        label: "Logged at",
        className: "pr-6 text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-sm text-muted-foreground",
        cell: (log) => formatAdminDateTime(log.occurredAt),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Activity logs</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Activity logs</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Review how internal admin users are changing businesses, moderation outcomes, roles, and taxonomy data across the workspace.
          </p>
        </div>
      </section>

      <AdminTable
        columns={columns}
        data={logs}
        rowKey={(log) => log.id}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by actor, action, target, or summary"
        leftToolbarContent={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Scope</span>
            <Select value={scopeFilter} onValueChange={(value) => setScopeFilter(value as "All" | AdminActivityLogScope)}>
              <SelectTrigger className="h-11 w-[210px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                <SelectValue placeholder="Filter by scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {adminActivityLogScopeOptions.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        resultSummary={resultSummary}
        emptyTitle="No activity logs found"
        emptyDescription={
          activityLogsResult.isError ? "Reload page and try again." : "Try a broader scope filter or a different search."
        }
        isLoading={activityLogsResult.isLoading}
      />
    </div>
  )
}

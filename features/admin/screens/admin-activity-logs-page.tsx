"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  adminActivityLogScopeOptions,
  mockAdminActivityLogs,
  type AdminActivityLogItem,
  type AdminActivityLogScope,
} from "@/features/admin/data/admin-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pageSize = 8

function getScopeTone(scope: AdminActivityLogScope) {
  switch (scope) {
    case "Businesses":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Reviews":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Users":
    case "Roles":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Establishment Types":
      return "bg-brand-soft-beige text-brand-orange border-brand-orange/10"
    case "Settings":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

export function AdminActivityLogsPage() {
  const [query, setQuery] = useState("")
  const [scopeFilter, setScopeFilter] = useState<"All" | AdminActivityLogScope>("All")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mockAdminActivityLogs.filter((log) => {
      const matchesScope = scopeFilter === "All" ? true : log.scope === scopeFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [log.actorName, log.actorRole, log.actionLabel, log.targetLabel, log.summary, log.scope]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery)

      return matchesScope && matchesQuery
    })
  }, [query, scopeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [query, scopeFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredLogs.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredLogs])

  const resultSummary =
    filteredLogs.length === 0
      ? "No activity logs match this view."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredLogs.length)} of ${filteredLogs.length}`

  const columns = useMemo<AdminTableColumn<AdminActivityLogItem>[]>(
    () => [
      {
        id: "actor",
        label: "Actor",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (log) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">{log.actorName}</p>
            <p className="text-sm text-muted-foreground">{log.actorRole}</p>
          </div>
        ),
      },
      {
        id: "action",
        label: "Action",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (log) => (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-brand-dark-green">{log.actionLabel}</p>
            <p className="text-sm leading-6 text-muted-foreground">{log.summary}</p>
          </div>
        ),
      },
      {
        id: "target",
        label: "Target",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (log) => (
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-dark-green">{log.targetLabel}</p>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getScopeTone(log.scope)}`}>
              {log.scope}
            </span>
          </div>
        ),
      },
      {
        id: "occurred-at",
        label: "Logged at",
        className: "py-4 pr-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-sm text-muted-foreground",
        cell: (log) => log.occurredAt,
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
        data={paginatedLogs}
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
        resultSummary={resultSummary}
        emptyTitle="No activity logs found"
        emptyDescription="Try a broader scope filter or a different search."
      />
    </div>
  )
}

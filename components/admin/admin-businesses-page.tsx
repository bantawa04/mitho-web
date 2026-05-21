"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Eye, Pencil, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminRowActions } from "@/components/admin/admin-row-actions"
import { AdminTable } from "@/components/admin/admin-table"
import { adminBusinessStatusOptions, mockAdminBusinesses, type AdminBusinessListItem, type AdminBusinessStatus } from "@/components/admin/admin-data"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pageSize = 6

function getStatusTone(status: AdminBusinessStatus) {
  switch (status) {
    case "Verified":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Claim request":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Pending":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Unclaimed":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

export function AdminBusinessesPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | AdminBusinessStatus>("All")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mockAdminBusinesses.filter((business) => {
      const matchesStatus = statusFilter === "All" ? true : business.status === statusFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : `${business.name} ${business.location}`.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [query, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBusinesses.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredBusinesses])

  const resultSummary =
    filteredBusinesses.length === 0
      ? "No businesses match the current search and status filters."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredBusinesses.length)} of ${filteredBusinesses.length}`

  const columns = [
    { id: "business", label: "Business", className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "location", label: "Location", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "status", label: "Status", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "updated", label: "Updated", className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
    { id: "action", label: "Action", className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55" },
  ]

  function renderBusinessRow(business: AdminBusinessListItem) {
    return (
      <>
        <TableCell className="px-6 py-5 align-top">
          <div className="flex items-start gap-3">
            <img
              src={business.avatarUrl}
              alt={business.name}
              className="h-11 w-11 rounded-xl border border-brand-deep-green/10 object-cover"
            />
            <div className="min-w-0">
              <p className="font-semibold text-brand-dark-green">{business.name}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="py-5 align-top text-sm text-muted-foreground">{business.location}</TableCell>
        <TableCell className="py-5 align-top">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(business.status)}`}>
            {business.status}
          </span>
        </TableCell>
        <TableCell className="py-5 align-top text-sm text-muted-foreground">{business.updatedAt}</TableCell>
        <TableCell className="py-5 pr-6 align-top text-right">
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => router.push(business.href),
                },
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => router.push(`/dashboard/businesses/${business.slug}/edit`),
                },
              ]}
            />
          </div>
        </TableCell>
      </>
    )
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Businesses</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Businesses</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Review and manage business listings, including verification state, claim activity, and publishing readiness.
          </p>
        </div>
      </section>

      <AdminTable
        columns={columns}
        data={paginatedBusinesses}
        rowKey={(business) => business.id}
        renderRow={renderBusinessRow}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search businesses by name or location"
        leftToolbarContent={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "All" | AdminBusinessStatus)}>
              <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {adminBusinessStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        rightToolbarContent={
          <Button asChild size="lg" className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92">
            <Link href="/add-business">
              <Plus className="h-4 w-4" />
              Add business
            </Link>
          </Button>
        }
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        resultSummary={resultSummary}
        emptyTitle="No businesses match this view."
        emptyDescription="Try clearing the search or choosing a broader status filter."
      />
    </div>
  )
}

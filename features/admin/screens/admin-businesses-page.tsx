"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Building2, ChevronRight, Eye, Pencil, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useBusinesses } from "@/hooks/use-businesses"
import type { Business, BusinessListingStatus, BusinessOwnershipStatus } from "@/types/business"

const pageSize = 6

type StatusFilterValue = "All" | BusinessListingStatus

const statusOptions: StatusFilterValue[] = ["All", "published", "pending_review", "suspended", "rejected"]

const statusLabels: Record<BusinessListingStatus, string> = {
  published: "Published",
  pending_review: "Pending review",
  suspended: "Suspended",
  rejected: "Rejected",
}

const ownershipLabels: Record<BusinessOwnershipStatus, string> = {
  unclaimed: "Unclaimed",
  claim_under_review: "Claim under review",
  claimed: "Claimed",
}

function getStatusTone(status: BusinessListingStatus) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "pending_review":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "suspended":
      return "bg-red-50 text-red-700 border-red-100"
    case "rejected":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function getOwnershipTone(status: BusinessOwnershipStatus) {
  switch (status) {
    case "claimed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "claim_under_review":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "unclaimed":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function formatBusinessLocation(business: Business) {
  return `${business.municipality.name}, ${business.district.name}`
}

export function AdminBusinessesPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: businesses, isLoading, isError } = useBusinesses()
  const { data: establishmentTypes } = useAdminEstablishmentTypes()
  const establishmentTypeMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of establishmentTypes ?? []) map.set(t.id, t.label)
    return map
  }, [establishmentTypes])

  const filteredBusinesses = useMemo(() => {
    if (!businesses) return []
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    return businesses.filter((business) => {
      const matchesStatus = statusFilter === "All" ? true : business.listingStatus === statusFilter
      const location = `${business.municipality.name} ${business.district.name} ${business.province.name}`
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : `${business.name} ${location}`.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [businesses, debouncedQuery, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter])

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
      : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredBusinesses.length)} of ${filteredBusinesses.length}`

  const columns = useMemo<AdminTableColumn<Business>[]>(
    () => [
      {
        id: "business",
        label: "Business",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (business) => (
          <div className="flex items-start gap-3">
            {business.logo?.publicUrl ? (
              <img
                src={business.logo.publicUrl}
                alt={business.logo.altText ?? business.name}
                className="h-11 w-11 rounded-xl border border-brand-deep-green/10 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige text-brand-deep-green/40">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-brand-dark-green">{business.name}</p>
              {business.establishmentTypeId && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {establishmentTypeMap.get(business.establishmentTypeId) ?? "—"}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "location",
        label: "Location",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (business) => formatBusinessLocation(business),
      },
      {
        id: "status",
        label: "Status",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (business) => (
          <div className="flex flex-col items-start gap-2">
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(business.listingStatus)}`}>
              Listing: {statusLabels[business.listingStatus]}
            </span>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOwnershipTone(business.ownershipStatus)}`}>
              Ownership: {ownershipLabels[business.ownershipStatus]}
            </span>
          </div>
        ),
      },
      {
        id: "updated",
        label: "Updated",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (business) =>
          new Date(business.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      },
      {
        id: "action",
        label: "Action",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
        cell: (business) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => router.push(`/admin/businesses/${business.id}`),
                },
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => router.push(`/admin/businesses/${business.id}/edit`),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [router, establishmentTypeMap],
  )

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

      {isError ? (
        <div className="rounded-[1.8rem] border border-red-100 bg-red-50 px-6 py-10 text-center">
          <p className="font-semibold text-red-700">Failed to load businesses</p>
          <p className="mt-1 text-sm text-red-600">Please refresh the page or try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="overflow-hidden rounded-[1.9rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]">
          <div className="space-y-0 divide-y divide-brand-deep-green/10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={paginatedBusinesses}
          rowKey={(business) => business.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search businesses by name or location"
          leftToolbarContent={
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}>
                <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All" ? "All" : statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          rightToolbarContent={
            <Button asChild size="lg" className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92">
              <Link href="/admin/businesses/new">
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
      )}
    </div>
  )
}

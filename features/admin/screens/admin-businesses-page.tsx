"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, DownloadCloud, Eye, Pencil, Plus, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { ClaimReviewModal } from "@/features/admin/components/claim-review-modal"
import { PlaceImportModal } from "@/features/admin/components/place-import-modal"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { DEFAULT_BUSINESS_LOGO } from "@/features/business/constants/business-media"
import { formatAdminBusinessTableLocation } from "@/features/admin/utils/admin-business-utils"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { getBusinessListingPresentation, getBusinessOwnershipPresentation } from "@/features/admin/utils/admin-status-utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useBusinesses } from "@/hooks/use-businesses"
import type { Business, BusinessListingStatus, BusinessOwnershipStatus } from "@/types/business"

type StatusFilterValue = "All" | BusinessListingStatus
type OwnershipFilterValue = "All" | BusinessOwnershipStatus

const statusOptions: StatusFilterValue[] = ["All", "published", "pending_review", "suspended", "rejected"]
const ownershipOptions: OwnershipFilterValue[] = ["All", "unclaimed", "claim_under_review", "claimed"]

export function AdminBusinessesPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All")
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilterValue>("All")
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)

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
      const matchesOwnership = ownershipFilter === "All" ? true : business.ownershipStatus === ownershipFilter
      const location = `${business.municipality.name} ${business.district.name} ${business.province.name}`
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : `${business.name} ${location}`.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesOwnership && matchesQuery
    })
  }, [businesses, debouncedQuery, statusFilter, ownershipFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter, ownershipFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBusinesses.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredBusinesses, pageSize])

  const resultSummary =
    filteredBusinesses.length === 0
      ? "No businesses match the current search and status filters."
      : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredBusinesses.length)} of ${filteredBusinesses.length}`

  const columns = useMemo<AdminTableColumn<Business>[]>(
    () => [
      {
        id: "business",
        label: "Business",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (business) => (
          <div className="flex items-start gap-3">
            <img
              src={business.logo?.publicUrl || DEFAULT_BUSINESS_LOGO}
              alt={business.logo?.altText ?? `${business.name} logo`}
              className="h-11 w-11 rounded-xl border border-border bg-white object-contain p-1"
            />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{business.name}</p>
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
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (business) => formatAdminBusinessTableLocation(business),
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (business) => (
          <div className="flex flex-col items-start gap-2">
            <AdminStatusBadge {...getBusinessListingPresentation(business.listingStatus)} label={`Listing: ${getBusinessListingPresentation(business.listingStatus).label}`} />
            <AdminStatusBadge {...getBusinessOwnershipPresentation(business.ownershipStatus)} label={`Ownership: ${getBusinessOwnershipPresentation(business.ownershipStatus).label}`} />
          </div>
        ),
      },
      {
        id: "updated",
        label: "Updated",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (business) => formatAdminDate(business.updatedAt),
      },
      {
        id: "action",
        label: "Action",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (business) => {
          const actions = [
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
          ]
          
          if (business.ownershipStatus === "claim_under_review" && business.pendingClaim) {
            actions.unshift({
              label: "Review Request",
              icon: <ShieldCheck className="h-4 w-4" />,
              onSelect: () => setSelectedClaimId(business.pendingClaim!.id),
            })
          }

          return (
            <div className="flex justify-end">
              <AdminRowActions items={actions} />
            </div>
          )
        },
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
        <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
          <p className="font-semibold text-red-700">Failed to load businesses</p>
          <p className="mt-1 text-sm text-red-600">Please refresh the page or try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="space-y-0 divide-y divide-border">
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
                <SelectTrigger className="h-11 w-[160px] rounded-xl border-border bg-white shadow-none">
                  <SelectValue placeholder="Listing status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All" ? "All" : getBusinessListingPresentation(status).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-sm font-medium text-muted-foreground ml-2">Ownership</span>
              <Select value={ownershipFilter} onValueChange={(value) => setOwnershipFilter(value as OwnershipFilterValue)}>
                <SelectTrigger className="h-11 w-[180px] rounded-xl border-border bg-white shadow-none">
                  <SelectValue placeholder="Ownership status" />
                </SelectTrigger>
                <SelectContent>
                  {ownershipOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "All" ? "All" : getBusinessOwnershipPresentation(opt).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          rightToolbarContent={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-11 rounded-xl px-5"
                onClick={() => setIsImportOpen(true)}
              >
                <DownloadCloud className="h-4 w-4" />
                Import from Google
              </Button>
              <Button asChild size="lg" className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92">
                <Link href="/admin/businesses/new">
                  <Plus className="h-4 w-4" />
                  Add business
                </Link>
              </Button>
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
          emptyTitle="No businesses match this view."
          emptyDescription="Try clearing the search or choosing a broader status filter."
        />
      )}

      <ClaimReviewModal
        claimId={selectedClaimId}
        onOpenChange={(open) => {
          if (!open) setSelectedClaimId(null)
        }}
      />

      <PlaceImportModal open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  )
}

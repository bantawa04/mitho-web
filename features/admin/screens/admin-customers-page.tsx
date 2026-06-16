"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye } from "lucide-react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, DEFAULT_ADMIN_PAGE_SIZE, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDateTime, formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { getOauthProviderPresentation, getUserStatusPresentation } from "@/features/admin/utils/admin-status-utils"
import { useAdminCustomers } from "@/hooks/use-admin-customers"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { AdminCustomerItem } from "@/types/admin-customers"

export function AdminCustomersPage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_ADMIN_PAGE_SIZE)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const customersResult = useAdminCustomers({
    page: currentPage,
    per_page: pageSize,
    query: debouncedQuery.trim() || undefined,
  })
  const customers = customersResult.data?.customers ?? []
  const totalPages = customersResult.data?.meta.totalPages ?? 1

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  )

  const resultSummary = useMemo(() => {
    if (customersResult.isError) return "Could not load customers."
    const totalItems = customersResult.data?.meta.totalItems ?? 0
    if (totalItems === 0) {
      return debouncedQuery.trim().length > 0 ? "No customers match this search." : "No customers found."
    }
    const page = customersResult.data?.meta.page ?? currentPage
    const start = (page - 1) * pageSize + 1
    const end = Math.min(start + customers.length - 1, totalItems)
    return `Showing ${start}-${end} of ${totalItems}`
  }, [currentPage, pageSize, customers.length, customersResult.data?.meta.page, customersResult.data?.meta.totalItems, customersResult.isError, debouncedQuery])

  const columns = useMemo<AdminTableColumn<AdminCustomerItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (customer) => <p className="text-sm font-semibold text-foreground">{customer.fullName || customer.email}</p>,
      },
      {
        id: "email",
        label: "Email",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (customer) => customer.email,
      },
      {
        id: "oauth",
        label: "OAuth Type",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (customer) => <AdminStatusBadge {...getOauthProviderPresentation(customer.socialProvider)} />,
      },
      {
        id: "has-business",
        label: "Has Business",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-foreground",
        cell: (customer) => (customer.hasBusiness ? "Yes" : "No"),
      },
      {
        id: "joined",
        label: "Joined Date",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (customer) => formatAdminDate(customer.createdAt),
      },
      {
        id: "action",
        label: "Actions",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (customer) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => setSelectedCustomerId(customer.id),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Customers</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Customers</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Look up customer and reviewer accounts without mixing them into internal user management.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={customers}
          rowKey={(customer) => customer.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search customers by name, email, or business"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          resultSummary={resultSummary}
          emptyTitle="No customers found"
          emptyDescription={customersResult.isError ? "Reload page and try again." : "Try a different name, email, or connected business."}
          isLoading={customersResult.isLoading}
        />
      </div>

      <AdminModal
        open={selectedCustomer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomerId(null)
        }}
        title="Customer details"
        description="Review the customer account context without leaving the directory."
        confirmLabel="Close"
        cancelLabel="Close"
        showFooter={false}
        size="lg"
      >
        {selectedCustomer ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="text-sm font-semibold text-foreground">{selectedCustomer.fullName || selectedCustomer.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">OAuth Type</p>
                <AdminStatusBadge {...getOauthProviderPresentation(selectedCustomer.socialProvider)} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Joined</p>
                <p className="text-sm text-muted-foreground">{formatAdminDateTime(selectedCustomer.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Last sign in</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.lastSignInAt ? formatAdminDateTime(selectedCustomer.lastSignInAt) : "Not signed in yet"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <AdminStatusBadge {...getUserStatusPresentation(selectedCustomer.status)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground">Has Business</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{selectedCustomer.hasBusiness ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground">Reviews</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{selectedCustomer.reviewsCount}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground">Profile complete</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{selectedCustomer.profileComplete ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-5">
              <p className="text-xs font-medium text-muted-foreground">Connected businesses</p>
              {selectedCustomer.businessNames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.businessNames.map((businessName) => (
                    <span
                      key={businessName}
                      className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-sm text-foreground"
                    >
                      {businessName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No connected businesses.</p>
              )}
            </div>
          </div>
        ) : null}
      </AdminModal>
    </>
  )
}

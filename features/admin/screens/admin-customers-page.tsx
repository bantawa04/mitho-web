"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye } from "lucide-react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { mockAdminCustomers, type AdminCustomerItem, type AdminCustomerOauthType } from "@/features/admin/data/admin-data"

const pageSize = 6

function getOauthTone(oauthType: AdminCustomerOauthType) {
  switch (oauthType) {
    case "Google":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Apple":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

export function AdminCustomersPage() {
  const [query, setQuery] = useState("")
  const [customers] = useState(mockAdminCustomers)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return customers.filter((customer) =>
      normalizedQuery.length === 0
        ? true
        : [customer.name, customer.email, customer.oauthType, ...customer.businessNames]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
    )
  }, [customers, query])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredCustomers.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredCustomers])

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  )

  const resultSummary =
    filteredCustomers.length === 0
      ? "No customers match this search."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredCustomers.length)} of ${filteredCustomers.length}`

  const columns = useMemo<AdminTableColumn<AdminCustomerItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (customer) => <p className="text-sm font-semibold text-brand-dark-green">{customer.name}</p>,
      },
      {
        id: "email",
        label: "Email",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (customer) => customer.email,
      },
      {
        id: "oauth",
        label: "OAuth Type",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (customer) => (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOauthTone(customer.oauthType)}`}>
            {customer.oauthType}
          </span>
        ),
      },
      {
        id: "has-business",
        label: "Has Business",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-brand-dark-green",
        cell: (customer) => (customer.hasBusiness ? "Yes" : "No"),
      },
      {
        id: "joined",
        label: "Joined Date",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (customer) => customer.joinedAt,
      },
      {
        id: "action",
        label: "Actions",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
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
          data={paginatedCustomers}
          rowKey={(customer) => customer.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search customers by name, email, or business"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No customers found"
          emptyDescription="Try a different name, email, or connected business."
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
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</p>
                <p className="text-sm font-semibold text-brand-dark-green">{selectedCustomer.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Email</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">OAuth Type</p>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOauthTone(selectedCustomer.oauthType)}`}>
                  {selectedCustomer.oauthType}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Joined</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.joinedAt}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Has Business</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedCustomer.hasBusiness ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Reviews</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedCustomer.reviewsCount}</p>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Collections</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedCustomer.collectionsCount}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-brand-deep-green/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Connected businesses</p>
              {selectedCustomer.businessNames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.businessNames.map((businessName) => (
                    <span
                      key={businessName}
                      className="inline-flex rounded-full border border-brand-deep-green/10 bg-white px-3 py-1.5 text-sm text-brand-dark-green"
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

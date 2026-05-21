"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Pencil, Plus, Shapes, Trash2 } from "lucide-react"
import { AdminConfirmModal, AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  adminEstablishmentTypeStatusOptions,
  mockAdminEstablishmentTypes,
  type AdminEstablishmentTypeItem,
  type AdminEstablishmentTypeStatus,
} from "@/features/admin/data/admin-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pageSize = 6

interface EstablishmentTypeDraft {
  name: string
  status: AdminEstablishmentTypeStatus
}

const emptyDraft: EstablishmentTypeDraft = {
  name: "",
  status: "Active",
}

function getStatusTone(status: AdminEstablishmentTypeStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Disabled":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function formatAdminTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function AdminEstablishmentTypesPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | AdminEstablishmentTypeStatus>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [types, setTypes] = useState(mockAdminEstablishmentTypes)
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [draft, setDraft] = useState<EstablishmentTypeDraft>(emptyDraft)

  const filteredTypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return types.filter((item) => {
      const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : item.name.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter, types])

  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [query, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTypes.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredTypes])

  const selectedType = useMemo(
    () => types.find((item) => item.id === selectedTypeId) ?? null,
    [selectedTypeId, types],
  )

  const typePendingDelete = useMemo(
    () => types.find((item) => item.id === deleteTypeId) ?? null,
    [deleteTypeId, types],
  )

  const resultSummary =
    filteredTypes.length === 0
      ? "No establishment types match this view."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredTypes.length)} of ${filteredTypes.length}`

  const columns = useMemo<AdminTableColumn<AdminEstablishmentTypeItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (item) => <p className="text-sm font-semibold text-brand-dark-green">{item.name}</p>,
      },
      {
        id: "status",
        label: "Status",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (item) => (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(item.status)}`}>
            {item.status}
          </span>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
        cell: (item) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => setSelectedTypeId(item.id),
                },
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => {
                    setEditingTypeId(item.id)
                    setDraft({
                      name: item.name,
                      status: item.status,
                    })
                    setIsFormModalOpen(true)
                  },
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => setDeleteTypeId(item.id),
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  function resetDraft() {
    setDraft(emptyDraft)
    setEditingTypeId(null)
  }

  function handleSave() {
    if (!draft.name.trim()) return

    if (editingTypeId) {
      setTypes((current) =>
        current.map((item) =>
          item.id === editingTypeId
            ? {
                ...item,
                name: draft.name.trim(),
                status: draft.status,
                updatedAt: formatAdminTimestamp(new Date()),
              }
            : item,
        ),
      )
    } else {
      const nextType: AdminEstablishmentTypeItem = {
        id: `establishment-type-${Date.now()}`,
        name: draft.name.trim(),
        status: draft.status,
        listingsCount: 0,
        updatedAt: formatAdminTimestamp(new Date()),
      }
      setTypes((current) => [nextType, ...current])
      setCurrentPage(1)
    }

    setIsFormModalOpen(false)
    resetDraft()
  }

  function handleDelete() {
    if (!typePendingDelete) return
    setTypes((current) => current.filter((item) => item.id !== typePendingDelete.id))
    setDeleteTypeId(null)
    if (selectedTypeId === typePendingDelete.id) setSelectedTypeId(null)
  }

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Establishment types</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Establishment types</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Manage the internal establishment-type taxonomy used across Mitho business listings.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={paginatedTypes}
          rowKey={(item) => item.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search establishment types by name"
          leftToolbarContent={
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as "All" | AdminEstablishmentTypeStatus)}
              >
                <SelectTrigger className="h-11 w-[180px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {adminEstablishmentTypeStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          rightToolbarContent={
            <Button
              type="button"
              size="lg"
              className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92"
              onClick={() => {
                resetDraft()
                setIsFormModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Add establishment type
            </Button>
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No establishment types found"
          emptyDescription="Try clearing the search or choosing a broader status filter."
        />
      </div>

      <AdminModal
        open={selectedType !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTypeId(null)
        }}
        title="Establishment type details"
        description="Review how this taxonomy item is currently represented in the admin directory."
        showFooter={false}
        size="md"
      >
        {selectedType ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</p>
                <p className="text-sm font-semibold text-brand-dark-green">{selectedType.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Status</p>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(selectedType.status)}`}>
                  {selectedType.status}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Linked listings</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedType.listingsCount}</p>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Last updated</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedType.updatedAt}</p>
              </div>
            </div>
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open)
          if (!open) resetDraft()
        }}
        title={editingTypeId ? "Edit establishment type" : "Add establishment type"}
        description={
          editingTypeId
            ? "Update the name or status for this establishment type."
            : "Create a new establishment type for Mitho business listings."
        }
        confirmLabel={editingTypeId ? "Save changes" : "Create type"}
        onConfirm={handleSave}
        isConfirmDisabled={!draft.name.trim()}
        size="md"
      >
        <div className="space-y-2">
          <Label htmlFor="establishment-type-name">Name</Label>
          <Input
            id="establishment-type-name"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Restaurant"
            className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={draft.status}
            onValueChange={(value) => setDraft((current) => ({ ...current, status: value as AdminEstablishmentTypeStatus }))}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
              <SelectValue placeholder="Choose a status" />
            </SelectTrigger>
            <SelectContent>
              {adminEstablishmentTypeStatusOptions
                .filter((status) => status !== "All")
                .map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </AdminModal>

      <AdminConfirmModal
        open={typePendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTypeId(null)
        }}
        title="Delete establishment type"
        description={
          typePendingDelete
            ? `Remove ${typePendingDelete.name} from the internal taxonomy. This is a mock delete flow for now.`
            : "Remove this establishment type from the internal taxonomy."
        }
        confirmLabel="Delete type"
        onConfirm={handleDelete}
      />
    </>
  )
}

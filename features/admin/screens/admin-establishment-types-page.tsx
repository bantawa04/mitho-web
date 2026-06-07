"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ChevronRight, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { AdminConfirmModal, AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { getTaxonomyStatusPresentation } from "@/features/admin/utils/admin-status-utils"
import {
  useAdminEstablishmentTypes,
  useCreateAdminEstablishmentType,
  useDeleteAdminEstablishmentType,
  useUpdateAdminEstablishmentType,
} from "@/hooks/use-admin-establishment-types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type {
  AdminEstablishmentTypeItem,
  AdminEstablishmentTypeStatusFilter,
  EstablishmentTypeStatus,
} from "@/types/admin-establishment-types"
import { establishmentTypeSchema, type EstablishmentTypeFormValues } from "@/lib/validators/admin"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pageSize = 6

const emptyEstablishmentTypeValues: EstablishmentTypeFormValues = {
  label: "",
  status: "active",
}

const statusOptions: Array<{ label: string; value: AdminEstablishmentTypeStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
]

export function AdminEstablishmentTypesPage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<AdminEstablishmentTypeStatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const establishmentTypesResult = useAdminEstablishmentTypes()
  const createEstablishmentType = useCreateAdminEstablishmentType()
  const updateEstablishmentType = useUpdateAdminEstablishmentType()
  const deleteEstablishmentType = useDeleteAdminEstablishmentType()

  const form = useForm<EstablishmentTypeFormValues>({
    resolver: zodResolver(establishmentTypeSchema),
    defaultValues: emptyEstablishmentTypeValues,
  })

  const types = establishmentTypesResult.data ?? []

  const filteredTypes = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    return types.filter((item) => {
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [item.label, item.slug].join(" ").toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [debouncedQuery, statusFilter, types])

  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter])

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
        cell: (item) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        ),
      },
      {
        id: "status",
        label: "Status",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (item) => (
          <AdminStatusBadge {...getTaxonomyStatusPresentation(item.status)} />
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
                    form.reset({
                      label: item.label,
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

  function resetForm() {
    form.reset(emptyEstablishmentTypeValues)
    setEditingTypeId(null)
  }

  const handleSave = form.handleSubmit(async (values) => {
    if (editingTypeId) {
      await updateEstablishmentType.mutateAsync({
        id: editingTypeId,
        payload: {
          label: values.label,
          status: values.status,
        },
      })
    } else {
      await createEstablishmentType.mutateAsync({
        label: values.label,
        status: values.status,
      })
      setCurrentPage(1)
    }

    setIsFormModalOpen(false)
    resetForm()
  })

  async function handleDelete() {
    if (!typePendingDelete) return
    await deleteEstablishmentType.mutateAsync(typePendingDelete.id)
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
                onValueChange={(value) => setStatusFilter(value as AdminEstablishmentTypeStatusFilter)}
              >
                <SelectTrigger className="h-11 w-[180px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
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
                resetForm()
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
          emptyDescription={
            establishmentTypesResult.isPending
              ? "Loading establishment types..."
              : "Try clearing the search or choosing a broader status filter."
          }
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
                <p className="text-sm font-semibold text-brand-dark-green">{selectedType.label}</p>
                <p className="text-xs text-muted-foreground">{selectedType.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Status</p>
                <AdminStatusBadge {...getTaxonomyStatusPresentation(selectedType.status)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Linked listings</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedType.listingsCount ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Last updated</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{formatAdminDateTime(selectedType.updatedAt)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open)
          if (!open) resetForm()
        }}
        title={editingTypeId ? "Edit establishment type" : "Add establishment type"}
        description={
          editingTypeId
            ? "Update the name or status for this establishment type."
            : "Create a new establishment type for Mitho business listings."
        }
        confirmLabel={editingTypeId ? "Save changes" : "Create type"}
        onConfirm={handleSave}
        isConfirmDisabled={!form.watch("label").trim()}
        isLoading={createEstablishmentType.isPending || updateEstablishmentType.isPending}
        size="md"
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Restaurant"
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={(value) => field.onChange(value as EstablishmentTypeStatus)}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Choose a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions
                      .filter((status) => status.value !== "all")
                      .map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </AdminModal>

      <AdminConfirmModal
        open={typePendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTypeId(null)
        }}
        title="Delete establishment type"
        description={
          typePendingDelete
            ? `Remove ${typePendingDelete.label} from the internal taxonomy.`
            : "Remove this establishment type from the internal taxonomy."
        }
        confirmLabel="Delete type"
        onConfirm={handleDelete}
        isLoading={deleteEstablishmentType.isPending}
      />
    </>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ChevronRight, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { AdminConfirmModal, AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  useAdminCuisines,
  useCreateAdminCuisine,
  useDeleteAdminCuisine,
  useUpdateAdminCuisine,
} from "@/hooks/use-admin-cuisines"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type {
  AdminCuisineItem,
  AdminCuisineStatusFilter,
  CuisineStatus,
} from "@/types/admin-cuisines"
import { cuisineSchema, type CuisineFormValues } from "@/lib/validators/admin"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pageSize = 6

const emptyCuisineValues: CuisineFormValues = {
  name: "",
  status: "active",
}

const statusOptions: Array<{ label: string; value: AdminCuisineStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
]

function getStatusLabel(status: CuisineStatus) {
  return status === "active" ? "Active" : "Disabled"
}

function getStatusTone(status: CuisineStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "disabled":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function formatAdminTimestamp(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue))
}

export function AdminCuisinesPage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [statusFilter, setStatusFilter] = useState<AdminCuisineStatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCuisineId, setSelectedCuisineId] = useState<string | null>(null)
  const [editingCuisineId, setEditingCuisineId] = useState<string | null>(null)
  const [deleteCuisineId, setDeleteCuisineId] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const cuisinesResult = useAdminCuisines()
  const createCuisine = useCreateAdminCuisine()
  const updateCuisine = useUpdateAdminCuisine()
  const deleteCuisine = useDeleteAdminCuisine()

  const form = useForm<CuisineFormValues>({
    resolver: zodResolver(cuisineSchema),
    defaultValues: emptyCuisineValues,
  })

  const cuisines = cuisinesResult.data ?? []

  const filteredCuisines = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    return cuisines.filter((item) => {
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [item.name, item.slug].join(" ").toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [cuisines, debouncedQuery, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCuisines.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedCuisines = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredCuisines.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredCuisines])

  const selectedCuisine = useMemo(
    () => cuisines.find((item) => item.id === selectedCuisineId) ?? null,
    [cuisines, selectedCuisineId],
  )

  const cuisinePendingDelete = useMemo(
    () => cuisines.find((item) => item.id === deleteCuisineId) ?? null,
    [cuisines, deleteCuisineId],
  )

  const resultSummary =
    filteredCuisines.length === 0
      ? "No cuisines match this view."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredCuisines.length)} of ${filteredCuisines.length}`

  const columns = useMemo<AdminTableColumn<AdminCuisineItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (item) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">{item.name}</p>
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
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(item.status)}`}>
            {getStatusLabel(item.status)}
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
                  onSelect: () => setSelectedCuisineId(item.id),
                },
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => {
                    setEditingCuisineId(item.id)
                    form.reset({
                      name: item.name,
                      status: item.status,
                    })
                    setIsFormModalOpen(true)
                  },
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => setDeleteCuisineId(item.id),
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [form],
  )

  function resetForm() {
    form.reset(emptyCuisineValues)
    setEditingCuisineId(null)
  }

  const handleSave = form.handleSubmit(async (values) => {
    if (editingCuisineId) {
      await updateCuisine.mutateAsync({
        id: editingCuisineId,
        payload: {
          name: values.name,
          status: values.status,
        },
      })
    } else {
      await createCuisine.mutateAsync({
        name: values.name,
        status: values.status,
      })
      setCurrentPage(1)
    }

    setIsFormModalOpen(false)
    resetForm()
  })

  async function handleDelete() {
    if (!cuisinePendingDelete) return
    await deleteCuisine.mutateAsync(cuisinePendingDelete.id)
    setDeleteCuisineId(null)
    if (selectedCuisineId === cuisinePendingDelete.id) setSelectedCuisineId(null)
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
            <span className="font-medium text-brand-dark-green">Cuisines</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Cuisines</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Manage the internal cuisine taxonomy used to describe the kinds of food a business serves.
            </p>
          </div>
        </section>

        <AdminTable
          columns={columns}
          data={paginatedCuisines}
          rowKey={(item) => item.id}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search cuisines by name"
          leftToolbarContent={
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AdminCuisineStatusFilter)}>
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
              Add cuisine
            </Button>
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          resultSummary={resultSummary}
          emptyTitle="No cuisines found"
          emptyDescription={
            cuisinesResult.isPending
              ? "Loading cuisines..."
              : "Try clearing the search or choosing a broader status filter."
          }
        />
      </div>

      <AdminModal
        open={selectedCuisine !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCuisineId(null)
        }}
        title="Cuisine details"
        description="Review how this cuisine is currently represented in the admin taxonomy."
        showFooter={false}
        size="md"
      >
        {selectedCuisine ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</p>
                <p className="text-sm font-semibold text-brand-dark-green">{selectedCuisine.name}</p>
                <p className="text-xs text-muted-foreground">{selectedCuisine.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Status</p>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(selectedCuisine.status)}`}>
                  {getStatusLabel(selectedCuisine.status)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Linked listings</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedCuisine.listingsCount ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Last updated</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{formatAdminTimestamp(selectedCuisine.updatedAt)}</p>
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
        title={editingCuisineId ? "Edit cuisine" : "Add cuisine"}
        description={
          editingCuisineId
            ? "Update the name or status for this cuisine."
            : "Create a new cuisine for Mitho business listings."
        }
        confirmLabel={editingCuisineId ? "Save changes" : "Create cuisine"}
        onConfirm={handleSave}
        isConfirmDisabled={!form.watch("name").trim()}
        isLoading={createCuisine.isPending || updateCuisine.isPending}
        size="md"
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nepali" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                <Select value={field.value} onValueChange={(value) => field.onChange(value as CuisineStatus)}>
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
        open={cuisinePendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCuisineId(null)
        }}
        title="Delete cuisine"
        description={
          cuisinePendingDelete
            ? `Remove ${cuisinePendingDelete.name} from the internal taxonomy.`
            : "Remove this cuisine from the internal taxonomy."
        }
        confirmLabel="Delete cuisine"
        onConfirm={handleDelete}
        isLoading={deleteCuisine.isPending}
      />
    </>
  )
}

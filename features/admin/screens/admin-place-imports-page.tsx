"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Eye, Search as SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  formatPlaceImportBatchBias,
  getPlaceImportBatchStatusPresentation,
} from "@/features/admin/utils/admin-place-import-utils"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useSearchPlaceImportBatch, usePlaceImportBatches } from "@/hooks/use-place-import"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { placeImportSearchSchema, type PlaceImportSearchFormValues } from "@/lib/validators/place-import"
import type { PlaceImportBatch } from "@/types/place-import"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const pageSize = 8

const defaultValues: PlaceImportSearchFormValues = {
  query: "",
  latitude: "",
  longitude: "",
  radiusMeters: "",
  maxResults: "10",
}

function toNumber(value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function AdminPlaceImportsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tableQuery, setTableQuery] = useState("")
  const debouncedTableQuery = useDebouncedValue(tableQuery, 300)
  const [currentPage, setCurrentPage] = useState(1)
  const batchesQuery = usePlaceImportBatches()
  const createBatch = useSearchPlaceImportBatch()

  const form = useForm<PlaceImportSearchFormValues>({
    resolver: zodResolver(placeImportSearchSchema),
    defaultValues,
  })

  const batches = batchesQuery.data ?? []

  const filteredBatches = useMemo(() => {
    const normalized = debouncedTableQuery.trim().toLowerCase()
    if (!normalized) return batches

    return batches.filter((batch) =>
      [batch.query, batch.source, formatPlaceImportBatchBias(batch)].join(" ").toLowerCase().includes(normalized),
    )
  }, [batches, debouncedTableQuery])

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedTableQuery])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedBatches = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBatches.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredBatches])

  const columns = useMemo<AdminTableColumn<PlaceImportBatch>[]>(
    () => [
      {
        id: "query",
        label: "Search",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-3 align-top",
        cell: (batch) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{batch.query}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{batch.source.replaceAll("_", " ")}</p>
          </div>
        ),
      },
      {
        id: "bias",
        label: "Location Bias",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top text-sm text-muted-foreground",
        cell: (batch) => formatPlaceImportBatchBias(batch),
      },
      {
        id: "count",
        label: "Fetched",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top text-sm font-medium text-foreground",
        cell: (batch) => batch.fetchedCount.toLocaleString(),
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top",
        cell: (batch) => <AdminStatusBadge {...getPlaceImportBatchStatusPresentation(batch.status)} />,
      },
      {
        id: "created",
        label: "Created",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 align-top text-sm text-muted-foreground",
        cell: (batch) => formatAdminDateTime(batch.createdAt),
      },
      {
        id: "actions",
        label: "Actions",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-3 pr-6 align-top text-right",
        cell: (batch) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "Open Batch",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => router.push(`/admin/imports/batches/${batch.id}`),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [router],
  )

  const resultSummary =
    filteredBatches.length === 0
      ? "No import batches yet."
      : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredBatches.length)} of ${filteredBatches.length}`

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const batch = await createBatch.mutateAsync({
        query: values.query.trim(),
        latitude: toNumber(values.latitude),
        longitude: toNumber(values.longitude),
        radiusMeters: toNumber(values.radiusMeters),
        maxResults: toNumber(values.maxResults),
      })

      toast({
        title: "Batch created",
        description: `Fetched ${batch.fetchedCount} places for review.`,
      })
      router.push(`/admin/imports/batches/${batch.id}`)
    } catch (error) {
      toast({
        title: "Could not fetch places",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  })

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Imports</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Place Imports</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Fetch Google place data for admin review, normalize the address, then import only the businesses worth keeping.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white px-5 py-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-brand-dark-green">
          <SearchIcon className="h-4 w-4" />
          <span>Fetch a new batch</span>
        </div>
        <Form {...form}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search query</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Pokhara momo, Kathmandu bakery, Bhaktapur cafe..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="radiusMeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Radius (m)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max results</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Google results are stored as raw snapshots first, then reviewed before anything is imported into Mitho.
              </p>
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92"
                disabled={createBatch.isPending}
              >
                {createBatch.isPending ? "Fetching..." : "Fetch from Google"}
              </Button>
            </div>
          </form>
        </Form>
      </section>

      <AdminTable
        columns={columns}
        data={paginatedBatches}
        rowKey={(batch) => batch.id}
        searchValue={tableQuery}
        onSearchChange={setTableQuery}
        searchPlaceholder="Filter recent batches by search or bias"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        resultSummary={resultSummary}
        emptyTitle="No import batches yet"
        emptyDescription="Run a search above to create the first review batch."
        isLoading={batchesQuery.isLoading}
      />
    </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Loader2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlaceImportMap } from "@/features/admin/components/place-import-map"
import { useToast } from "@/hooks/use-toast"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { useImportGooglePlaces, useSearchGooglePlaces } from "@/hooks/use-place-import"
import type { MapCoordinates } from "@/lib/google-maps"
import { cn } from "@/lib/utils"
import {
  PLACE_IMPORT_CATEGORIES,
  type ImportGooglePlaceItem,
  type ImportGooglePlacesResult,
  type PlaceImportCategoryValue,
  type PlaceSearchResult,
} from "@/types/place-import"
import { PlaceImportNormalizeRow, type NormalizeRowState } from "./place-import-normalize-row"

// Kathmandu — sensible default center for a Nepal-first product.
const DEFAULT_CENTER: MapCoordinates = { lat: 27.7172, lng: 85.324 }
const DEFAULT_RADIUS = 1500

type WizardStep = "search" | "normalize" | "result"

interface PlaceImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function emptyRowState(establishmentTypeId?: string): NormalizeRowState {
  return {
    provinceId: null,
    districtId: null,
    municipalityId: null,
    wardNo: null,
    establishmentTypeId: establishmentTypeId ?? "",
  }
}

export function PlaceImportModal({ open, onOpenChange }: PlaceImportModalProps) {
  const { toast } = useToast()
  const searchMutation = useSearchGooglePlaces()
  const importMutation = useImportGooglePlaces()
  const { data: establishmentTypes } = useAdminEstablishmentTypes()
  const activeEstablishmentTypes = useMemo(
    () => (establishmentTypes ?? []).filter((type) => type.status === "active"),
    [establishmentTypes],
  )

  const [step, setStep] = useState<WizardStep>("search")
  const [marker, setMarker] = useState<MapCoordinates | null>(DEFAULT_CENTER)
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_RADIUS)
  const [categories, setCategories] = useState<PlaceImportCategoryValue[]>([])
  const [results, setResults] = useState<PlaceSearchResult[] | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [rowState, setRowState] = useState<Record<string, NormalizeRowState>>({})
  const [importResult, setImportResult] = useState<ImportGooglePlacesResult | null>(null)

  const selectedResults = useMemo(
    () => (results ?? []).filter((result) => selectedIds.has(result.externalId)),
    [results, selectedIds],
  )

  const allRowsValid = useMemo(
    () =>
      selectedResults.every((result) => {
        const state = rowState[result.externalId]
        return Boolean(state?.provinceId && state.districtId && state.municipalityId && state.wardNo)
      }),
    [selectedResults, rowState],
  )

  function resetAndClose() {
    onOpenChange(false)
    // Defer reset so the dialog close animation isn't janky.
    setTimeout(() => {
      setStep("search")
      setMarker(DEFAULT_CENTER)
      setRadiusMeters(DEFAULT_RADIUS)
      setCategories([])
      setResults(null)
      setSelectedIds(new Set())
      setRowState({})
      setImportResult(null)
    }, 200)
  }

  function toggleCategory(value: PlaceImportCategoryValue, checked: boolean) {
    setCategories((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
  }

  function toggleSelect(externalId: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(externalId)
      else next.delete(externalId)
      return next
    })
  }

  async function handleFetch() {
    if (!marker) {
      toast({ title: "Drop a pin", description: "Place a pin on the map to set the search center.", variant: "destructive" })
      return
    }
    if (categories.length === 0) {
      toast({ title: "Pick a category", description: "Select at least one business category to fetch.", variant: "destructive" })
      return
    }
    try {
      const data = await searchMutation.mutateAsync({
        latitude: marker.lat,
        longitude: marker.lng,
        radiusMeters,
        categories,
      })
      setResults(data)
      setSelectedIds(new Set())
      if (data.length === 0) {
        toast({ title: "No places found", description: "Try a larger radius or different categories." })
      }
    } catch {
      toast({ title: "Search failed", description: "Could not fetch places from Google. Try again.", variant: "destructive" })
    }
  }

  function handleProceed() {
    if (selectedResults.length === 0) {
      toast({ title: "Select businesses", description: "Tick at least one business to import.", variant: "destructive" })
      return
    }
    setRowState((prev) => {
      const next = { ...prev }
      for (const result of selectedResults) {
        if (!next[result.externalId]) {
          next[result.externalId] = emptyRowState(result.suggestedEstablishmentTypeId)
        }
      }
      return next
    })
    setStep("normalize")
  }

  async function handleImport() {
    if (!allRowsValid) {
      toast({ title: "Complete addresses", description: "Set province, district, municipality and ward for every row.", variant: "destructive" })
      return
    }
    const items: ImportGooglePlaceItem[] = selectedResults.map((result) => {
      const state = rowState[result.externalId]
      return {
        externalId: result.externalId,
        name: result.name,
        phone: result.phone,
        website: result.website,
        googleMapsUrl: result.googleMapsUrl,
        formattedAddress: result.formattedAddress,
        latitude: result.latitude,
        longitude: result.longitude,
        establishmentTypeId: state.establishmentTypeId || undefined,
        provinceId: state.provinceId!,
        districtId: state.districtId!,
        municipalityId: state.municipalityId!,
        wardNo: state.wardNo!,
      }
    })

    try {
      const result = await importMutation.mutateAsync({ items })
      setImportResult(result)
      setStep("result")
      toast({
        title: "Import complete",
        description: `${result.created} created, ${result.skippedDuplicate} skipped, ${result.failed} failed.`,
      })
    } catch {
      toast({ title: "Import failed", description: "Could not import the selected places. Try again.", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : resetAndClose())}>
      <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-border bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:max-w-5xl">
        <div className="flex max-h-[calc(100vh-2rem)] w-full min-w-0 flex-col">
          <DialogHeader className="shrink-0 space-y-1 border-b border-border px-6 py-5 text-left">
            <DialogTitle className="text-lg font-semibold text-foreground">Import businesses from Google</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {step === "search" && "Set a location and categories, then fetch nearby businesses."}
              {step === "normalize" && "Set the Mitho address for each business before importing."}
              {step === "result" && "Import summary."}
            </p>
          </DialogHeader>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-6 py-6">
            {step === "search" && (
              <SearchStep
                marker={marker}
                onSelectMarker={setMarker}
                radiusMeters={radiusMeters}
                onRadiusChange={setRadiusMeters}
                categories={categories}
                onToggleCategory={toggleCategory}
                results={results}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onFetch={handleFetch}
                isFetching={searchMutation.isPending}
              />
            )}

            {step === "normalize" && (
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-medium text-muted-foreground">Business</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Province</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">District</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Municipality</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Ward</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedResults.map((result) => (
                    <PlaceImportNormalizeRow
                      key={result.externalId}
                      place={result}
                      value={rowState[result.externalId] ?? emptyRowState(result.suggestedEstablishmentTypeId)}
                      establishmentTypes={activeEstablishmentTypes}
                      onChange={(next) => setRowState((prev) => ({ ...prev, [result.externalId]: next }))}
                    />
                  ))}
                </TableBody>
              </Table>
            )}

            {step === "result" && importResult && <ResultStep result={importResult} />}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-6 py-4">
            <div className="text-sm text-muted-foreground">
              {step === "search" && results ? `${selectedResults.length} selected of ${results.length}` : null}
              {step === "normalize" ? `${selectedResults.length} to import` : null}
            </div>
            <div className="flex items-center gap-3">
              {step === "search" && (
                <>
                  <Button variant="outline" onClick={resetAndClose}>
                    Close
                  </Button>
                  <Button onClick={handleProceed} disabled={selectedResults.length === 0}>
                    Proceed
                  </Button>
                </>
              )}
              {step === "normalize" && (
                <>
                  <Button variant="outline" onClick={() => setStep("search")}>
                    Back
                  </Button>
                  <Button onClick={handleImport} disabled={!allRowsValid || importMutation.isPending}>
                    {importMutation.isPending ? "Importing..." : `Import ${selectedResults.length}`}
                  </Button>
                </>
              )}
              {step === "result" && <Button onClick={resetAndClose}>Done</Button>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SearchStepProps {
  marker: MapCoordinates | null
  onSelectMarker: (coordinates: MapCoordinates) => void
  radiusMeters: number
  onRadiusChange: (value: number) => void
  categories: PlaceImportCategoryValue[]
  onToggleCategory: (value: PlaceImportCategoryValue, checked: boolean) => void
  results: PlaceSearchResult[] | null
  selectedIds: Set<string>
  onToggleSelect: (externalId: string, checked: boolean) => void
  onFetch: () => void
  isFetching: boolean
}

function SearchStep({
  marker,
  onSelectMarker,
  radiusMeters,
  onRadiusChange,
  categories,
  onToggleCategory,
  results,
  selectedIds,
  onToggleSelect,
  onFetch,
  isFetching,
}: SearchStepProps) {
  const radiusLabel = radiusMeters >= 1000 ? `${(radiusMeters / 1000).toFixed(1)} km` : `${radiusMeters} m`

  return (
    <div className="space-y-5">
      <PlaceImportMap
        defaultCenter={DEFAULT_CENTER}
        marker={marker}
        radiusMeters={radiusMeters}
        onSelect={onSelectMarker}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Search radius</span>
            <span className="text-sm text-muted-foreground">{radiusLabel}</span>
          </div>
          <Slider
            value={[radiusMeters]}
            min={100}
            max={10000}
            step={100}
            onValueChange={([value]) => onRadiusChange(value)}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Categories</span>
          <div className="grid grid-cols-2 gap-2">
            {PLACE_IMPORT_CATEGORIES.map((category) => (
              <label key={category.value} className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={categories.includes(category.value)}
                  onCheckedChange={(checked) => onToggleCategory(category.value, checked === true)}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onFetch} disabled={isFetching}>
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Fetch businesses
            </>
          )}
        </Button>
      </div>

      {results ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-10" />
                <TableHead className="text-xs font-medium text-muted-foreground">Business</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Phone</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Rating</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No places found. Try a larger radius or different categories.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result) => (
                  <TableRow
                    key={result.externalId}
                    className={cn("border-border align-top text-sm", result.alreadyImported && "opacity-60")}
                  >
                    <TableCell className="py-3">
                      <Checkbox
                        checked={selectedIds.has(result.externalId)}
                        disabled={result.alreadyImported}
                        onCheckedChange={(checked) => onToggleSelect(result.externalId, checked === true)}
                      />
                    </TableCell>
                    <TableCell className="min-w-[200px] py-3">
                      <p className="font-medium text-foreground">{result.name}</p>
                      {result.formattedAddress ? (
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{result.formattedAddress}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="py-3 text-muted-foreground">{result.phone ?? "—"}</TableCell>
                    <TableCell className="py-3 text-muted-foreground">
                      {result.rating ? `${result.rating.toFixed(1)} (${result.reviewCount ?? 0})` : "—"}
                    </TableCell>
                    <TableCell className="py-3">
                      {result.alreadyImported ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Already imported
                        </Badge>
                      ) : (
                        <Badge variant="outline">New</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}

function ResultStep({ result }: { result: ImportGooglePlacesResult }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryStat label="Created" value={result.created} tone="text-emerald-600" />
        <SummaryStat label="Skipped" value={result.skippedDuplicate} tone="text-amber-600" />
        <SummaryStat label="Failed" value={result.failed} tone="text-red-600" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-medium text-muted-foreground">Business</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((item) => (
              <TableRow key={item.externalId} className="border-border text-sm">
                <TableCell className="py-3 font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="py-3">
                  {item.status === "created" && <Badge variant="secondary">Created</Badge>}
                  {item.status === "skipped_duplicate" && <Badge variant="outline">Already existed</Badge>}
                  {item.status === "failed" && (
                    <span className="text-xs text-red-600">{item.message ?? "Failed"}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3 text-center">
      <p className={cn("text-2xl font-semibold", tone)}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

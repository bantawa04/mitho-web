"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, ExternalLink, Link2, MapPin, RotateCcw, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import {
  formatPlaceImportCandidateLocation,
  getPlaceImportAddressPresentation,
  getPlaceImportDuplicatePresentation,
  getPlaceImportStatusPresentation,
} from "@/features/admin/utils/admin-place-import-utils"
import { formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { useDistricts, useMunicipalities, useProvinces } from "@/hooks/use-nepal-admin"
import {
  useImportPlaceImportCandidate,
  useMatchPlaceImportCandidate,
  usePlaceImportCandidate,
  useRejectPlaceImportCandidate,
  useUpdatePlaceImportCandidate,
} from "@/hooks/use-place-import"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import {
  placeImportCandidateSchema,
  type PlaceImportCandidateFormValues,
} from "@/lib/validators/place-import"
import type { PlaceImportCandidate } from "@/types/place-import"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const emptyValues: PlaceImportCandidateFormValues = {
  name: "",
  phone: "",
  website: "",
  formattedAddress: "",
  addressLine1: "",
  addressLine2: "",
  provinceId: "",
  districtId: "",
  municipalityId: "",
  wardNo: "",
  latitude: "",
  longitude: "",
  establishmentTypeId: "",
  adminNotes: "",
}

function toStringValue(value?: number | string | null) {
  if (typeof value === "number") return String(value)
  if (typeof value === "string") return value
  return ""
}

function toFormValues(candidate: PlaceImportCandidate): PlaceImportCandidateFormValues {
  return {
    name: candidate.name,
    phone: candidate.phone ?? candidate.raw.phone ?? "",
    website: candidate.website ?? candidate.raw.website ?? "",
    formattedAddress: candidate.formattedAddress ?? candidate.raw.formattedAddress ?? "",
    addressLine1: candidate.addressLine1 ?? "",
    addressLine2: candidate.addressLine2 ?? "",
    provinceId: toStringValue(candidate.provinceId),
    districtId: toStringValue(candidate.districtId),
    municipalityId: toStringValue(candidate.municipalityId),
    wardNo: toStringValue(candidate.wardNo),
    latitude: toStringValue(candidate.latitude),
    longitude: toStringValue(candidate.longitude),
    establishmentTypeId: candidate.suggestedEstablishmentTypeId ?? "",
    adminNotes: candidate.adminNotes ?? "",
  }
}

function parseNumber(value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseInteger(value?: string) {
  const parsed = parseNumber(value)
  return typeof parsed === "number" ? Math.trunc(parsed) : undefined
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="text-sm leading-6 text-foreground">{value && value.trim() ? value : "—"}</p>
    </div>
  )
}

export function AdminPlaceImportCandidatePage({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [duplicateOverrideRequired, setDuplicateOverrideRequired] = useState(false)

  const candidateQuery = usePlaceImportCandidate(id)
  const candidate = candidateQuery.data
  const updateCandidate = useUpdatePlaceImportCandidate()
  const importCandidate = useImportPlaceImportCandidate()
  const matchCandidate = useMatchPlaceImportCandidate()
  const rejectCandidate = useRejectPlaceImportCandidate()
  const establishmentTypesQuery = useAdminEstablishmentTypes()

  const form = useForm<PlaceImportCandidateFormValues>({
    resolver: zodResolver(placeImportCandidateSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!candidate) return
    form.reset(toFormValues(candidate))
    setDuplicateOverrideRequired(false)
  }, [candidate, form])

  const provinceId = parseInteger(form.watch("provinceId")) ?? null
  const districtId = parseInteger(form.watch("districtId")) ?? null
  const municipalityId = parseInteger(form.watch("municipalityId")) ?? null

  const provincesQuery = useProvinces()
  const districtsQuery = useDistricts(provinceId)
  const municipalitiesQuery = useMunicipalities(districtId)

  const selectedMunicipality = useMemo(
    () => municipalitiesQuery.data?.find((item) => item.id === municipalityId) ?? null,
    [municipalitiesQuery.data, municipalityId],
  )

  const wardOptions = selectedMunicipality?.wards
    ? Array.from({ length: selectedMunicipality.wards }, (_, index) => String(index + 1))
    : candidate?.municipality?.wards
      ? Array.from({ length: candidate.municipality.wards }, (_, index) => String(index + 1))
      : []

  const establishmentTypes = useMemo(
    () => (establishmentTypesQuery.data ?? []).filter((item) => item.status === "active"),
    [establishmentTypesQuery.data],
  )

  async function handleSave(values: PlaceImportCandidateFormValues) {
    try {
      await updateCandidate.mutateAsync({
        id,
        payload: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          website: values.website.trim(),
          formattedAddress: values.formattedAddress.trim(),
          addressLine1: values.addressLine1.trim(),
          addressLine2: values.addressLine2.trim(),
          provinceId: parseInteger(values.provinceId),
          districtId: parseInteger(values.districtId),
          municipalityId: parseInteger(values.municipalityId),
          wardNo: parseInteger(values.wardNo),
          latitude: parseNumber(values.latitude),
          longitude: parseNumber(values.longitude),
          establishmentTypeId: values.establishmentTypeId.trim(),
          adminNotes: values.adminNotes.trim(),
        },
      })
      setDuplicateOverrideRequired(false)
      toast({
        title: "Candidate updated",
        description: "The Mitho-ready draft has been saved.",
      })
    } catch (error) {
      toast({
        title: "Could not save candidate",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  async function handleLinkExisting(businessId: string, businessName: string) {
    try {
      await matchCandidate.mutateAsync({
        id,
        payload: {
          businessId,
          note: `Linked from candidate review to ${businessName}`,
        },
      })
      toast({
        title: "Linked to existing business",
        description: `${candidate?.name ?? "Candidate"} now points to ${businessName}.`,
      })
    } catch (error) {
      toast({
        title: "Could not link business",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  async function handleImport(forceDuplicateOverride = false) {
    try {
      const result = await importCandidate.mutateAsync({
        id,
        payload: { forceDuplicateOverride },
      })

      const businessId = result.importedBusiness?.id ?? result.matchedBusiness?.id
      toast({
        title: result.matchedBusiness ? "Existing business linked" : "Business imported",
        description: `${result.name} is now available in Mitho.`,
      })
      if (businessId) router.push(`/admin/businesses/${businessId}`)
    } catch (error) {
      const message = extractApiErrorMessage(error)
      if (message.toLowerCase().includes("duplicate")) {
        setDuplicateOverrideRequired(true)
        toast({
          title: "Duplicate review required",
          description: "Check the likely matches, then confirm the override if this should still become a new business.",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Could not import candidate",
        description: message,
        variant: "destructive",
      })
    }
  }

  async function handleReject() {
    try {
      await rejectCandidate.mutateAsync({
        id,
        payload: {
          note: (form.getValues("adminNotes") ?? "").trim() || undefined,
        },
      })
      toast({
        title: "Candidate rejected",
        description: `${candidate?.name ?? "Candidate"} was removed from the pending queue.`,
      })
    } catch (error) {
      toast({
        title: "Could not reject candidate",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  if (candidateQuery.isLoading && !candidate) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="h-[560px] rounded-xl border border-border bg-white shadow-sm" />
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="rounded-xl border border-rose-100 bg-rose-50 px-6 py-10">
        <h1 className="text-lg font-semibold text-rose-700">Candidate not available</h1>
        <p className="mt-2 text-sm text-rose-600">
          We could not load this place import candidate. Try refreshing or return to the batch list.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={() => candidateQuery.refetch()}>
            Retry
          </Button>
          <Button
            className="bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
            onClick={() => router.push("/admin/imports")}
          >
            Back to imports
          </Button>
        </div>
      </div>
    )
  }

  const linkedBusiness = candidate.importedBusiness ?? candidate.matchedBusiness ?? null

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/imports" className="transition-colors hover:text-brand-dark-green">
            Imports
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/admin/imports/batches/${candidate.batch.id}`} className="transition-colors hover:text-brand-dark-green">
            Batch
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Candidate</span>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">{candidate.name}</h1>
            <AdminStatusBadge {...getPlaceImportStatusPresentation(candidate.importStatus)} size="md" />
            <AdminStatusBadge {...getPlaceImportDuplicatePresentation(candidate.duplicateCheckStatus)} size="md" />
            <AdminStatusBadge {...getPlaceImportAddressPresentation(candidate.addressReviewStatus)} size="md" />
          </div>
          <p className="max-w-4xl text-sm text-muted-foreground">
            Batch query “{candidate.batch.query}” · external ID {candidate.externalId} · last updated {formatAdminDateTime(candidate.updatedAt)}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        {duplicateOverrideRequired ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
            <p className="text-sm font-medium text-amber-800">
              Likely duplicates were found. Review the linked suggestions on the left, then use “Import anyway” only if this should still create a new business.
            </p>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Google snapshot</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Raw provider data stays untouched here so you can compare it against the Mitho-ready form.
              </p>
            </div>

            <div className="space-y-6 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Name" value={candidate.raw.name} />
                <DetailRow label="Primary type" value={candidate.raw.primaryType} />
                <DetailRow label="Phone" value={candidate.raw.phone} />
                <DetailRow label="Website" value={candidate.raw.website} />
                <DetailRow label="Rating" value={candidate.raw.rating ? `${candidate.raw.rating} / 5` : undefined} />
                <DetailRow label="Review count" value={candidate.raw.reviewCount ? String(candidate.raw.reviewCount) : undefined} />
              </div>

              <div className="space-y-2 border-t border-border pt-5">
                <DetailRow label="Google address" value={candidate.raw.formattedAddress} />
                <DetailRow
                  label="Coordinates"
                  value={
                    typeof candidate.raw.latitude === "number" && typeof candidate.raw.longitude === "number"
                      ? `${candidate.raw.latitude}, ${candidate.raw.longitude}`
                      : undefined
                  }
                />
                <div className="flex flex-wrap gap-2">
                  {(candidate.raw.types ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {item.replaceAll("_", " ")}
                    </span>
                  ))}
                </div>
                {candidate.raw.googleMapsUrl ? (
                  <Button asChild variant="outline" size="sm" className="mt-2 rounded-lg">
                    <a href={candidate.raw.googleMapsUrl} target="_blank" rel="noreferrer">
                      Open on Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>

              <div className="space-y-3 border-t border-border pt-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Likely matches</p>
                  <p className="text-sm text-muted-foreground">
                    Link an existing business if this place already belongs in Mitho.
                  </p>
                </div>

                {linkedBusiness ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">{linkedBusiness.name}</p>
                      <p className="text-xs text-emerald-700">
                        {candidate.importedBusiness ? "Imported destination" : "Linked existing business"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => router.push(`/admin/businesses/${linkedBusiness.id}`)}
                    >
                      Open
                    </Button>
                  </div>
                ) : null}

                {candidate.duplicateHints.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No likely duplicates were found for this candidate.</p>
                ) : (
                  <div className="divide-y divide-border rounded-lg border border-border">
                    {candidate.duplicateHints.map((hint) => (
                      <div key={hint.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{hint.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {hint.municipality.name}, {hint.district.name}, {hint.province.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => router.push(`/admin/businesses/${hint.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-lg bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
                            onClick={() => handleLinkExisting(hint.id, hint.name)}
                            disabled={matchCandidate.isPending}
                          >
                            <Link2 className="h-4 w-4" />
                            Link existing
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-border pt-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Raw payload</p>
                  <p className="text-sm text-muted-foreground">Useful when you need the untouched provider response during review.</p>
                </div>
                <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 px-4 py-3 text-xs leading-6 text-slate-100">
                  {JSON.stringify(candidate.raw.rawPayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mitho-ready draft</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Normalize the address and details here before importing this place into the live businesses directory.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)}>
                <div className="space-y-0">
                  <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="establishmentTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Establishment type</FormLabel>
                          <Select
                            value={field.value || "__none__"}
                            onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-border bg-white shadow-none">
                                <SelectValue placeholder="Choose a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">No type selected</SelectItem>
                              {establishmentTypes.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Required before import" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border px-6 py-5">
                    <FormField
                      control={form.control}
                      name="formattedAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formatted address</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} className="rounded-xl border-border bg-white shadow-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border px-6 py-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-brand-dark-green">
                      <MapPin className="h-4 w-4" />
                      <span>Administrative address</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address line 1</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Street, chowk, landmark..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address line 2</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" placeholder="Area or neighborhood" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="provinceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <Select
                              value={field.value || undefined}
                              onValueChange={(value) => {
                                field.onChange(value)
                                form.setValue("districtId", "", { shouldDirty: true })
                                form.setValue("municipalityId", "", { shouldDirty: true })
                                form.setValue("wardNo", "", { shouldDirty: true })
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-border bg-white shadow-none">
                                  <SelectValue placeholder={provincesQuery.isLoading ? "Loading..." : "Choose a province"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(provincesQuery.data ?? []).map((item) => (
                                  <SelectItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="districtId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <Select
                              value={field.value || undefined}
                              onValueChange={(value) => {
                                field.onChange(value)
                                form.setValue("municipalityId", "", { shouldDirty: true })
                                form.setValue("wardNo", "", { shouldDirty: true })
                              }}
                              disabled={!provinceId || districtsQuery.isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-border bg-white shadow-none">
                                  <SelectValue placeholder={!provinceId ? "Choose a province first" : districtsQuery.isLoading ? "Loading..." : "Choose a district"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(districtsQuery.data ?? []).map((item) => (
                                  <SelectItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="municipalityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Municipality</FormLabel>
                            <Select
                              value={field.value || undefined}
                              onValueChange={(value) => {
                                field.onChange(value)
                                form.setValue("wardNo", "", { shouldDirty: true })
                              }}
                              disabled={!districtId || municipalitiesQuery.isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-border bg-white shadow-none">
                                  <SelectValue placeholder={!districtId ? "Choose a district first" : municipalitiesQuery.isLoading ? "Loading..." : "Choose a municipality"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(municipalitiesQuery.data ?? []).map((item) => (
                                  <SelectItem key={item.id} value={String(item.id)}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wardNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ward No.</FormLabel>
                            <Select value={field.value || undefined} onValueChange={field.onChange} disabled={wardOptions.length === 0}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-border bg-white shadow-none">
                                  <SelectValue placeholder={wardOptions.length === 0 ? "Choose a municipality first" : "Choose a ward"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {wardOptions.map((ward) => (
                                  <SelectItem key={ward} value={ward}>
                                    Ward {ward}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border px-6 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" />
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
                              <Input {...field} className="h-11 rounded-xl border-border bg-white shadow-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="adminNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admin notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  className="rounded-xl border-border bg-white shadow-none"
                                  placeholder="What changed during review, why this is safe to import, or why it should be rejected..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-border px-6 py-5">
                  <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                    <p>{formatPlaceImportCandidateLocation(candidate) || "Administrative address still needs review."}</p>
                    {candidate.rejectionNote ? <p>Last rejection note: {candidate.rejectionNote}</p> : null}
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => form.reset(toFormValues(candidate))}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset fields
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl text-rose-700 hover:text-rose-700"
                        onClick={() => void handleReject()}
                        disabled={rejectCandidate.isPending}
                      >
                        Reject candidate
                      </Button>
                      {linkedBusiness ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => router.push(`/admin/businesses/${linkedBusiness.id}`)}
                        >
                          Open linked business
                        </Button>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                      <Button
                        type="submit"
                        variant="outline"
                        className="rounded-xl"
                        disabled={updateCandidate.isPending}
                      >
                        <Save className="h-4 w-4" />
                        {updateCandidate.isPending ? "Saving..." : "Save changes"}
                      </Button>
                      <Button
                        type="button"
                        className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
                        onClick={() => void handleImport(false)}
                        disabled={importCandidate.isPending}
                      >
                        {importCandidate.isPending ? "Importing..." : "Import candidate"}
                      </Button>
                      {duplicateOverrideRequired ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-xl"
                          onClick={() => void handleImport(true)}
                          disabled={importCandidate.isPending}
                        >
                          Import anyway
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
}

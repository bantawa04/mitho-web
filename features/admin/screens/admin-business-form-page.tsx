"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Building2, ChevronRight, Globe, Image, Mail, MapPin, Phone, ShieldCheck, UtensilsCrossed, X } from "lucide-react"
import { useBusiness, useCreateBusiness, useUpdateBusiness } from "@/hooks/use-businesses"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { useMunicipalities } from "@/hooks/use-nepal-admin"
import { BusinessCuisineField } from "@/features/business/components/business-cuisine-field"
import { BusinessLocationFields } from "@/features/business/components/business-location-fields"
import { GoogleMapPicker } from "@/features/business/components/google-map-picker"
import { buildAdminBusinessFormValues } from "@/features/business/utils/business-form-utils"
import { businessSchema, type BusinessFormValues } from "@/lib/validators/admin"
import type { Media } from "@/types/media"
import { MediaPickerDialog } from "@/features/admin/components/media-picker-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import type { BusinessOwnershipStatus } from "@/types/business"

interface AdminBusinessFormPageProps {
  mode: "create" | "edit"
  businessId?: string
}

const serviceAmenityFields = [
  { name: "amenityDineIn", label: "Dine in" },
  { name: "amenityTakeaway", label: "Takeaway" },
  { name: "amenityDelivery", label: "Delivery" },
] as const

const paymentAmenityFields = [
  { name: "amenityCash", label: "Cash" },
  { name: "amenityCard", label: "Card" },
  { name: "amenityQr", label: "QR" },
] as const

const facilityAmenityFields = [
  { name: "amenityParking", label: "Parking" },
  { name: "amenityWifi", label: "WiFi" },
] as const

const dietaryAmenityFields = [
  { name: "amenityVegetarian", label: "Vegetarian" },
  { name: "amenityVegan", label: "Vegan" },
  { name: "amenityHalal", label: "Halal" },
  { name: "amenityNonVeg", label: "Non Veg" },
] as const

const ownershipLabels: Record<BusinessOwnershipStatus, string> = {
  unclaimed: "Unclaimed",
  claim_under_review: "Claim under review",
  claimed: "Claimed",
}

function getClaimReviewHref(businessId: string, claimId?: string) {
  const params = new URLSearchParams({ status: "pending", businessId })
  if (claimId) params.set("claimId", claimId)
  return `/admin/business-claims?${params.toString()}`
}

export function AdminBusinessFormPage({ mode, businessId }: AdminBusinessFormPageProps) {
  const router = useRouter()

  const { data: existing, isLoading: isLoadingBusiness } = useBusiness(
    mode === "edit" ? businessId : undefined,
  )
  const { data: establishmentTypes, isLoading: isLoadingTypes } = useAdminEstablishmentTypes()

  const createMutation = useCreateBusiness()
  const updateMutation = useUpdateBusiness()
  const isPending = createMutation.isPending || updateMutation.isPending

  // Media display state — full Media objects for thumbnails
  const [logoMedia, setLogoMedia] = useState<Media | null>(null)
  const [bannerMedia, setBannerMedia] = useState<Media | null>(null)
  const [photosMedia, setPhotosMedia] = useState<Media[]>([])
  const [formRenderKey, setFormRenderKey] = useState(0)

  // Dialog open state for each picker
  const [logoPickerOpen, setLogoPickerOpen] = useState(false)
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false)
  const [photosPickerOpen, setPhotosPickerOpen] = useState(false)

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema) as Resolver<BusinessFormValues>,
    defaultValues: {
      name: "",
      description: "",
      listingStatus: "published",
      establishmentTypeId: "",
      cuisineIds: [],
      logoId: "",
      bannerId: "",
      photos: [],
      phone: "",
      phoneSecondary: "",
      email: "",
      provinceId: "",
      districtId: "",
      municipalityId: "",
      wardNo: "",
      area: "",
      nearestLandmark: "",
      addressNote: "",
      latitude: null,
      longitude: null,
      websiteUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
      tiktokUrl: "",
      amenityDineIn: false,
      amenityTakeaway: false,
      amenityDelivery: false,
      amenityCash: false,
      amenityCard: false,
      amenityQr: false,
      amenityParking: false,
      amenityWifi: false,
      amenityAirConditioning: false,
      amenityOutdoorSeating: false,
      amenityVegetarian: false,
      amenityVegan: false,
      amenityHalal: false,
      amenityNonVeg: false,
      sendClaimInvitation: false,
      claimInvitationEmail: "",
    },
  })

  useEffect(() => {
    if (existing) {
      form.reset(buildAdminBusinessFormValues(existing))
      setFormRenderKey((current) => current + 1)
      if (existing.logo) setLogoMedia(existing.logo)
      if (existing.banner) setBannerMedia(existing.banner)
      if (existing.photos?.length) setPhotosMedia(existing.photos)
    }
  }, [existing, form])
  function handleLogoSelect(media: Media) {
    setLogoMedia(media)
    form.setValue("logoId", media.id)
  }

  function handleBannerSelect(media: Media) {
    setBannerMedia(media)
    form.setValue("bannerId", media.id)
  }

  function handlePhotoSelect(media: Media) {
    setPhotosMedia((prev) => {
      if (prev.find((m) => m.id === media.id)) return prev
      return [...prev, media]
    })
    const current = form.getValues("photos") ?? []
    if (!current.includes(media.id)) {
      form.setValue("photos", [...current, media.id])
    }
  }

  function handlePhotoSelectMany(mediaItems: Media[]) {
    setPhotosMedia((prev) => {
      const existingIds = new Set(prev.map((item) => item.id))
      const additions = mediaItems.filter((item) => !existingIds.has(item.id))
      return additions.length > 0 ? [...prev, ...additions] : prev
    })

    const current = form.getValues("photos") ?? []
    const merged = Array.from(new Set([...current, ...mediaItems.map((item) => item.id)]))
    form.setValue("photos", merged)
  }

  function removePhoto(id: string) {
    setPhotosMedia((prev) => prev.filter((m) => m.id !== id))
    form.setValue(
      "photos",
      (form.getValues("photos") ?? []).filter((pid) => pid !== id),
    )
  }

  async function onSubmit(values: BusinessFormValues) {
    const links = {
      website: values.websiteUrl || undefined,
      facebook: values.facebookUrl || undefined,
      instagram: values.instagramUrl || undefined,
      twitter: values.twitterUrl || undefined,
      youtube: values.youtubeUrl || undefined,
      tiktok: values.tiktokUrl || undefined,
    }
    const hasLinks = Object.values(links).some(Boolean)

    const amenities = {
      services: {
        dine_in: values.amenityDineIn ?? false,
        takeaway: values.amenityTakeaway ?? false,
        delivery: values.amenityDelivery ?? false,
      },
      payment: {
        cash: values.amenityCash ?? false,
        card: values.amenityCard ?? false,
        qr: values.amenityQr ?? false,
      },
      facilities: {
        parking: values.amenityParking ?? false,
        wifi: values.amenityWifi ?? false,
        air_conditioning: values.amenityAirConditioning ?? false,
        outdoor_seating: values.amenityOutdoorSeating ?? false,
      },
      dietary: {
        vegetarian: values.amenityVegetarian ?? false,
        vegan: values.amenityVegan ?? false,
        halal: values.amenityHalal ?? false,
        non_veg: values.amenityNonVeg ?? false,
      },
    }

    const payload = {
      name: values.name,
      description: values.description || undefined,
      listingStatus: values.listingStatus,
      establishmentTypeId: values.establishmentTypeId || undefined,
      cuisineIds: values.cuisineIds,
      logoId: values.logoId,
      bannerId: values.bannerId,
      // Gallery photos are only attached at creation; afterwards they are
      // managed through the gallery approval flow, not business updates.
      photos: mode === "create" ? values.photos ?? [] : undefined,
      phone: values.phone,
      phoneSecondary: values.phoneSecondary || undefined,
      email: values.email || undefined,
      links: hasLinks ? links : undefined,
      provinceId: Number(values.provinceId),
      districtId: Number(values.districtId),
      municipalityId: Number(values.municipalityId),
      wardNo: Number(values.wardNo),
      area: values.area || undefined,
      nearestLandmark: values.nearestLandmark || undefined,
      addressNote: values.addressNote || undefined,
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
      amenities,
      // Claim invitation — create mode only
      ...(mode === "create" && values.sendClaimInvitation
        ? {
            sendClaimInvitation: true,
            claimInvitationEmail: values.claimInvitationEmail || null,
          }
        : {}),
    }

    if (mode === "create") {
      await createMutation.mutateAsync(payload, {
        onSuccess: () => {
          toast({ title: "Business created", description: `${values.name} has been added.` })
          router.push("/admin/businesses")
        },
        onError: () => {
          toast({ title: "Failed to create business", description: "Please try again.", variant: "destructive" })
        },
      })
    } else if (businessId) {
      await updateMutation.mutateAsync(
        { id: businessId, payload },
        {
          onSuccess: () => {
            toast({ title: "Business updated", description: `${values.name} has been saved.` })
            router.push("/admin/businesses")
          },
          onError: () => {
            toast({ title: "Failed to update business", description: "Please try again.", variant: "destructive" })
          },
        },
      )
    }
  }

  const watchedLatitude = form.watch("latitude")
  const watchedLongitude = form.watch("longitude")
  const watchedDistrictId = form.watch("districtId")
  const watchedMunicipalityId = form.watch("municipalityId")
  const sendClaimInvitation = form.watch("sendClaimInvitation")

  const { data: municipalities } = useMunicipalities(
    watchedDistrictId && /^\d+$/.test(watchedDistrictId) ? Number(watchedDistrictId) : null
  )
  const selectedMunicipality = municipalities?.find((m) => String(m.id) === watchedMunicipalityId)
  const cityLabel = selectedMunicipality?.name ?? existing?.municipality?.name ?? "Nepal"

  const markerPosition =
    typeof watchedLatitude === "number" && typeof watchedLongitude === "number"
      ? { lat: watchedLatitude, lng: watchedLongitude }
      : null

  const defaultCenter = markerPosition ?? { lat: 27.7172, lng: 85.324 }

  if (mode === "edit" && isLoadingBusiness) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-brand-deep-green/10" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  const breadcrumbLabel = mode === "edit" ? (existing?.name ?? "Edit") : "Add business"
  const existingLogoId = form.watch("logoId")
  const existingBannerId = form.watch("bannerId")
  const existingPhotos = form.watch("photos") ?? []
  const claimReviewHref = existing ? getClaimReviewHref(existing.id, existing.pendingClaim?.id) : "/admin/business-claims"
  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/businesses" className="transition-colors hover:text-brand-dark-green">
            Businesses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">{breadcrumbLabel}</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">
            {mode === "create" ? "Add business" : "Edit business"}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {mode === "create"
              ? "Create a new business listing in the directory."
              : "Update the core listing details for this business."}
          </p>
        </div>
      </section>

      <Form {...form}>
        <form key={formRenderKey} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Left Column: Form Content */}
          <div className="space-y-6">
            {/* Core details */}
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Core details</h2>
                  <p className="text-sm text-muted-foreground">The public business identity and listing categorization.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 border-t border-border pt-6 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <RequiredLabel>Business name</RequiredLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. The Himalayan Kitchen" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="A short description of the business for the public listing…"
                          className="w-full rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-3 text-sm leading-6 text-brand-dark-green shadow-none outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                        />
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
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingTypes}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                            <SelectValue placeholder={isLoadingTypes ? "Loading…" : "Choose a type"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTypes ? (
                            <div className="px-2 py-3">
                              <Skeleton className="h-5 w-full" />
                            </div>
                          ) : (
                            establishmentTypes?.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.label}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <BusinessCuisineField
                  control={form.control}
                  name="cuisineIds"
                  chipsClassName="min-h-[44px] rounded-xl border-brand-deep-green/10 bg-white shadow-none"
                />
              </div>
            </section>

            {/* Location */}
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Location</h2>
                  <p className="text-sm text-muted-foreground">Where the business is physically located.</p>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 space-y-4">
                <BusinessLocationFields
                  form={form}
                  inputClassName="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  selectTriggerClassName="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none"
                  selectedLocation={{
                    province: existing?.province,
                    district: existing?.district,
                    municipality: existing?.municipality,
                  }}
                />

                {/* Google Map Picker */}
                <div className="space-y-3 pt-4 border-t border-brand-deep-green/5">
                  <div className="space-y-1">
                    <FormLabel>Map marker</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Drop the pin where the business is located. Drag the pin to adjust coordinates.
                    </FormDescription>
                  </div>
                  <GoogleMapPicker
                    cityLabel={cityLabel}
                    defaultCenter={defaultCenter}
                    markerPosition={markerPosition}
                    onSelect={(coordinates) => {
                      form.setValue("latitude", coordinates.lat, { shouldDirty: true, shouldValidate: true })
                      form.setValue("longitude", coordinates.lng, { shouldDirty: true, shouldValidate: true })
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Amenities</h2>
                  <p className="text-sm text-muted-foreground">Services, payment options, facilities, and dietary accommodations.</p>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                {/* Services */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-brand-dark-green">Services</p>
                  <div className="space-y-2">
                    {serviceAmenityFields.map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-sm text-brand-dark-green">
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-brand-dark-green">Payment methods</p>
                  <div className="space-y-2">
                    {paymentAmenityFields.map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-sm text-brand-dark-green">
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-3 border-t border-border pt-4 sm:border-t-0 sm:pt-0">
                  <p className="text-sm font-semibold text-brand-dark-green">Facilities</p>
                  <div className="space-y-2">
                    {facilityAmenityFields.map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-sm text-brand-dark-green">
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div className="space-y-3 border-t border-border pt-4 sm:border-t-0 sm:pt-0">
                  <p className="text-sm font-semibold text-brand-dark-green">Dietary restrictions</p>
                  <div className="space-y-2">
                    {dietaryAmenityFields.map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-sm text-brand-dark-green">
                              {label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Claim invitation — creation only */}
            {mode === "create" ? (
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Claim invitation</h2>
                  <p className="text-sm text-muted-foreground">Optionally notify a business owner so they can claim this listing.</p>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="sendClaimInvitation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium cursor-pointer text-sm text-brand-dark-green">
                          Send claim invitation email
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Sends an email to the entered address with instructions to claim this listing.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {sendClaimInvitation ? (
                  <FormField
                    control={form.control}
                    name="claimInvitationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invitation email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="owner@business.com"
                            className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </div>
            </section>
            ) : null}

            {/* Photos gallery — creation only; existing galleries are managed via Gallery Approval */}
            {mode === "create" ? (
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Image className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Photos gallery</h2>
                  <p className="text-sm text-muted-foreground">Gallery images shown on the business details page.</p>
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Images</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted cursor-pointer"
                    onClick={() => setPhotosPickerOpen(true)}
                  >
                    Add photo
                  </Button>
                </div>
                {photosMedia.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {photosMedia.map((photo) => (
                      <div key={photo.id} className="relative aspect-square">
                        <img
                          src={photo.publicUrl}
                          alt={photo.altText ?? photo.filename}
                          className="h-full w-full rounded-xl border border-brand-deep-green/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : existingPhotos.length > 0 ? (
                  <p className="text-xs text-muted-foreground">{existingPhotos.length} photo{existingPhotos.length > 1 ? "s" : ""} already set. Add new photos above.</p>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted px-6 py-6 text-center">
                    <p className="text-sm text-muted-foreground">No photos added yet.</p>
                  </div>
                )}
              </div>
            </section>
            ) : null}
          </div>

          {/* Right Column: Sticky Sidebar Controls */}
          <div className="space-y-6 xl:sticky xl:top-6">
            {/* Publishing widget */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark-green">Publishing</h3>
              <FormField
                  control={form.control}
                  name="listingStatus"
                  render={({ field }) => (
                  <FormItem>
                    <RequiredLabel>Listing status</RequiredLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                          <SelectValue placeholder="Choose a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending_review">Pending review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Controls whether this listing is publicly published. Ownership claims are reviewed separately.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92 font-medium cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? "Saving changes…" : mode === "create" ? "Create business" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted font-medium cursor-pointer"
                  onClick={() => router.push(mode === "edit" ? `/admin/businesses/${businessId}` : "/admin/businesses")}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </section>

            {/* Media uploads */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark-green">Primary media</h3>

              {/* Logo */}
              <div className="space-y-2">
                <FormLabel>Logo (Avatar)</FormLabel>
                <div className="flex items-center flex-col gap-3">
                  {logoMedia ? (
                    <div className="relative shrink-0">
                      <img
                        src={logoMedia.publicUrl}
                        alt="Logo"
                        className="h-14 w-14 rounded-xl border border-brand-deep-green/10 object-cover bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => { setLogoMedia(null); form.setValue("logoId", "") }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : existingLogoId ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-muted text-xs text-muted-foreground shrink-0">
                      Set
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted text-xs h-9 cursor-pointer"
                    onClick={() => setLogoPickerOpen(true)}
                  >
                    {existingLogoId || logoMedia ? "Change logo" : "Choose logo"}
                  </Button>
                </div>
              </div>

              {/* Featured image */}
              <div className="space-y-2 border-t border-border pt-4">
                <FormLabel>Featured image</FormLabel>
                <FormDescription>
                  Shown prominently at the top of the public business page and in shared links.
                </FormDescription>
                <div className="space-y-3">
                  {bannerMedia ? (
                    <div className="relative w-full h-24 overflow-hidden rounded-xl border border-brand-deep-green/10">
                      <img
                        src={bannerMedia.publicUrl}
                        alt="Featured image"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setBannerMedia(null); form.setValue("bannerId", "") }}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : existingBannerId ? (
                    <div className="flex w-full h-20 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-muted text-xs text-muted-foreground">
                      Featured image configured
                    </div>
                  ) : (
                    <div className="flex w-full h-20 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-xs text-muted-foreground">
                      No featured image chosen
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted text-xs h-9 cursor-pointer"
                    onClick={() => setBannerPickerOpen(true)}
                  >
                    {existingBannerId || bannerMedia ? "Change featured image" : "Choose featured image"}
                  </Button>
                </div>
              </div>
            </section>

            {/* Contacts & Links */}
            <section className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark-green">Contact & Links</h3>

              {/* Basic Contacts */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Phone</RequiredLabel>
                      <FormControl>
                        <Input {...field} placeholder="+977 9800000000" className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneSecondary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+977 9800000001" className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="hello@business.com" className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Web presence */}
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Web presence</p>
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Website URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" placeholder="https://example.com" className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Facebook URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" placeholder="https://facebook.com/..." className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Instagram URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" placeholder="https://instagram.com/..." className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tiktokUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">TikTok URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" placeholder="https://tiktok.com/@..." className="h-10 rounded-xl border-brand-deep-green/10 shadow-none text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </div>
        </form>
      </Form>

      {/* Media picker dialogs */}
      <MediaPickerDialog
        open={logoPickerOpen}
        onOpenChange={setLogoPickerOpen}
        accept="image"
        onSelect={handleLogoSelect}
      />
      <MediaPickerDialog
        open={bannerPickerOpen}
        onOpenChange={setBannerPickerOpen}
        accept="image"
        onSelect={handleBannerSelect}
      />
      <MediaPickerDialog
        open={photosPickerOpen}
        onOpenChange={setPhotosPickerOpen}
        accept="image"
        multiple
        onSelect={handlePhotoSelect}
        onSelectMany={handlePhotoSelectMany}
      />
    </div>
  )
}

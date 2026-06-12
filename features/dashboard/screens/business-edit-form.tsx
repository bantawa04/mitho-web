"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { Building2, Globe, MapPin, Phone, Sparkles, UtensilsCrossed, X } from "lucide-react"
import { useEstablishmentTypes } from "@/hooks/use-establishment-types"
import { useUpdateBusiness } from "@/hooks/use-businesses"
import { useMunicipalities } from "@/hooks/use-nepal-admin"
import { BusinessCuisineField } from "@/features/business/components/business-cuisine-field"
import { BusinessLocationFields } from "@/features/business/components/business-location-fields"
import { GoogleMapPicker } from "@/features/business/components/google-map-picker"
import { buildBusinessOwnerFormValues } from "@/features/business/utils/business-form-utils"
import { MediaPickerDialog } from "@/features/admin/components/media-picker-dialog"
import { businessOwnerSchema, type BusinessOwnerFormValues } from "@/lib/validators/admin"
import type { Business } from "@/types/business"
import type { Media } from "@/types/media"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { MithoButton } from "@/components/mitho/mitho-button"

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
  { name: "amenityAirConditioning", label: "Air conditioning" },
  { name: "amenityOutdoorSeating", label: "Outdoor seating" },
] as const

const dietaryAmenityFields = [
  { name: "amenityVegetarian", label: "Vegetarian" },
  { name: "amenityVegan", label: "Vegan" },
  { name: "amenityHalal", label: "Halal" },
  { name: "amenityNonVeg", label: "Non veg" },
] as const

interface BusinessEditFormProps {
  businessId: string
  business: Business
}

export function BusinessEditForm({ businessId, business: b }: BusinessEditFormProps) {
  const {
    data: establishmentTypes,
    isLoading: isLoadingTypes,
    isError: isErrorLoadingTypes,
  } = useEstablishmentTypes()
  const updateMutation = useUpdateBusiness()
  const isPending = updateMutation.isPending

  const [logoMedia, setLogoMedia] = useState<Media | null>(null)
  const [bannerMedia, setBannerMedia] = useState<Media | null>(null)
  const [formRenderKey, setFormRenderKey] = useState(0)
  const [logoPickerOpen, setLogoPickerOpen] = useState(false)
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false)

  const form = useForm<BusinessOwnerFormValues>({
    resolver: zodResolver(businessOwnerSchema) as Resolver<BusinessOwnerFormValues>,
    defaultValues: buildBusinessOwnerFormValues(b),
  })

  useEffect(() => {
    form.reset(buildBusinessOwnerFormValues(b))
    setFormRenderKey((k) => k + 1)
    setLogoMedia(b.logo ?? null)
    setBannerMedia(b.banner ?? null)
  }, [b, form])

  function handleLogoSelect(media: Media) {
    setLogoMedia(media)
    form.setValue("logoId", media.id)
  }

  function handleBannerSelect(media: Media) {
    setBannerMedia(media)
    form.setValue("bannerId", media.id)
  }

  function handleDiscard() {
    form.reset(buildBusinessOwnerFormValues(b))
    setLogoMedia(b.logo ?? null)
    setBannerMedia(b.banner ?? null)
  }

  async function onSubmit(values: BusinessOwnerFormValues) {
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

    await updateMutation.mutateAsync(
      {
        id: businessId,
        payload: {
          name: values.name,
          description: values.description || undefined,
          establishmentTypeId: values.establishmentTypeId || undefined,
          cuisineIds: values.cuisineIds,
          logoId: values.logoId,
          bannerId: values.bannerId,
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
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Changes saved", description: `${values.name} has been updated.` })
        },
        onError: () => {
          toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" })
        },
      },
    )
  }

  const watchedDistrictId = form.watch("districtId")
  const watchedMunicipalityId = form.watch("municipalityId")
  const watchedLatitude = form.watch("latitude")
  const watchedLongitude = form.watch("longitude")
  const watchedName = form.watch("name")
  const watchedDescription = form.watch("description")
  const watchedPhone = form.watch("phone")
  const watchedWebsite = form.watch("websiteUrl")

  const { data: municipalities } = useMunicipalities(
    watchedDistrictId && /^\d+$/.test(watchedDistrictId) ? Number(watchedDistrictId) : null,
  )
  const selectedMunicipality = municipalities?.find((m) => String(m.id) === watchedMunicipalityId)
  const cityLabel = selectedMunicipality?.name ?? b.municipality?.name ?? "Nepal"

  const markerPosition =
    typeof watchedLatitude === "number" && typeof watchedLongitude === "number"
      ? { lat: watchedLatitude, lng: watchedLongitude }
      : null
  const defaultCenter = markerPosition ?? { lat: 27.7172, lng: 85.324 }

  const existingLogoId = form.watch("logoId")
  const existingBannerId = form.watch("bannerId")
  const establishmentTypeOptions =
    b.establishmentType && !establishmentTypes?.some((type) => type.id === b.establishmentType?.id)
      ? [...(establishmentTypes ?? []), b.establishmentType]
      : (establishmentTypes ?? [])

  return (
    <div className="pb-12">
      <Form {...form}>
        <form
          key={formRenderKey}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Sticky action bar */}
          <div className="sticky top-40 sm:top-[100px] z-20 flex items-center justify-between gap-4 rounded-[1.5rem] border border-brand-deep-green/10 bg-white/96 px-5 py-4 shadow-[0_8px_24px_rgba(10,70,53,0.07)] backdrop-blur-sm">
            <div className="min-w-0">
              <p className="type-eyebrow text-brand-deep-green/60">Business info</p>
              <h1 className="mt-0.5 truncate text-lg font-semibold leading-tight text-brand-dark-green">{b.name}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isPending}
                className="hidden h-9 cursor-pointer items-center rounded-xl border border-brand-deep-green/14 px-4 text-sm font-medium text-brand-dark-green transition hover:bg-brand-soft-beige/40 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="h-9 cursor-pointer rounded-xl bg-brand-dark-green px-5 text-sm font-medium text-white transition hover:bg-brand-dark-green/92 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">

          {/* Left column */}
          <div className="space-y-5">
            {/* Core details */}
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Core details</h2>
                  <p className="text-sm text-muted-foreground">The public business identity and listing categorization.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 border-t border-brand-deep-green/10 pt-6 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. The Himalayan Kitchen"
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
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
                        disabled={isLoadingTypes || isErrorLoadingTypes}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                            <SelectValue
                              placeholder={
                                isLoadingTypes
                                  ? "Loading…"
                                  : isErrorLoadingTypes
                                    ? "Unable to load types"
                                    : "Choose a type"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTypes ? (
                            <div className="px-2 py-3">
                              <Skeleton className="h-5 w-full" />
                            </div>
                          ) : isErrorLoadingTypes ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              Establishment types are unavailable right now.
                            </div>
                          ) : (
                            establishmentTypeOptions.map((type) => (
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
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Location</h2>
                  <p className="text-sm text-muted-foreground">Where the business is physically located.</p>
                </div>
              </div>
              <div className="mt-6 border-t border-brand-deep-green/10 pt-6 space-y-4">
                <BusinessLocationFields
                  form={form}
                  inputClassName="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  selectTriggerClassName="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none"
                  selectedLocation={{
                    province: b.province,
                    district: b.district,
                    municipality: b.municipality,
                  }}
                />
                <div className="space-y-3 pt-4 border-t border-brand-deep-green/5">
                  <div className="space-y-1">
                    <FormLabel>Map marker</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Drop the pin where the business is located. Drag to adjust.
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
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Amenities</h2>
                  <p className="text-sm text-muted-foreground">
                    Services, payment options, facilities, and dietary accommodations.
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-brand-deep-green/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
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
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                              />
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
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                              />
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

                <div className="space-y-3 border-t border-brand-deep-green/10 pt-4 sm:border-t-0 sm:pt-0">
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
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                              />
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

                <div className="space-y-3 border-t border-brand-deep-green/10 pt-4 sm:border-t-0 sm:pt-0">
                  <p className="text-sm font-semibold text-brand-dark-green">Dietary</p>
                  <div className="space-y-2">
                    {dietaryAmenityFields.map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                              />
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

            {/* Contact & links */}
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Contact & links</h2>
                  <p className="text-sm text-muted-foreground">How customers reach the business online and by phone.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 border-t border-brand-deep-green/10 pt-6 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+977 9800000000"
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
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
                        <Input
                          {...field}
                          placeholder="+977 9800000001"
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="hello@business.com"
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://example.com"
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
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
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://facebook.com/..."
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
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
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://instagram.com/..."
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter / X URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://twitter.com/..."
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
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
                      <FormLabel>TikTok URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://tiktok.com/@..."
                          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 xl:sticky xl:top-[180px]">

            {/* Primary media */}
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)] space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark-green">Primary media</h3>

              {/* Logo */}
              <div className="space-y-2">
                <FormLabel>Logo</FormLabel>
                <div className="flex flex-col items-center gap-3">
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/30 text-xs text-muted-foreground shrink-0">
                      Set
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/10 text-brand-deep-green/40 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setLogoPickerOpen(true)}
                    className="w-full rounded-xl border border-brand-deep-green/14 py-2 text-xs font-medium text-brand-dark-green hover:bg-brand-soft-beige/40 transition cursor-pointer"
                  >
                    {existingLogoId || logoMedia ? "Change logo" : "Choose logo"}
                  </button>
                </div>
              </div>

              {/* Banner */}
              <div className="space-y-2 border-t border-brand-deep-green/10 pt-4">
                <FormLabel>Cover banner</FormLabel>
                <div className="space-y-3">
                  {bannerMedia ? (
                    <div className="relative w-full h-24 overflow-hidden rounded-xl border border-brand-deep-green/10">
                      <img
                        src={bannerMedia.publicUrl}
                        alt="Banner"
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
                    <div className="flex w-full h-20 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/30 text-xs text-muted-foreground">
                      Cover configured
                    </div>
                  ) : (
                    <div className="flex w-full h-20 items-center justify-center rounded-xl border border-dashed border-brand-deep-green/15 bg-brand-soft-beige/5 text-xs text-muted-foreground">
                      No cover photo chosen
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setBannerPickerOpen(true)}
                    className="w-full rounded-xl border border-brand-deep-green/14 py-2 text-xs font-medium text-brand-dark-green hover:bg-brand-soft-beige/40 transition cursor-pointer"
                  >
                    {existingBannerId || bannerMedia ? "Change banner" : "Choose banner"}
                  </button>
                </div>
              </div>
            </section>

          {/* Live preview */}
            <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                <h3 className="text-sm font-semibold text-brand-dark-green">Live preview</h3>
              </div>
              <div className="space-y-2 text-sm text-brand-dark-green">
                <p className="font-semibold leading-snug">{watchedName || "Business name"}</p>
                {watchedDescription ? (
                  <p className="text-xs leading-5 text-muted-foreground line-clamp-3">{watchedDescription}</p>
                ) : null}
                {watchedPhone ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0 text-brand-orange" />
                    <span>{watchedPhone}</span>
                  </div>
                ) : null}
                {watchedWebsite ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3 shrink-0 text-brand-orange" />
                    <span className="break-all">{watchedWebsite}</span>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          </div>{/* end main content grid */}
        </form>
      </Form>

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
    </div>
  )
}

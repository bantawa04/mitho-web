"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Building2, ChevronRight, Globe, Image, Mail, MapPin, Phone, UtensilsCrossed, X } from "lucide-react"
import { useBusiness, useCreateBusiness, useUpdateBusiness } from "@/hooks/use-businesses"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { businessSchema, type BusinessFormValues } from "@/lib/validators/admin"
import type { Media } from "@/types/media"
import { MediaPickerDialog } from "@/features/admin/components/media-picker-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

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
  { name: "amenityEsewa", label: "eSewa" },
  { name: "amenityKhalti", label: "Khalti" },
  { name: "amenityQr", label: "QR" },
] as const

const facilityAmenityFields = [
  { name: "amenityParking", label: "Parking" },
  { name: "amenityWifi", label: "WiFi" },
  { name: "amenityAirConditioning", label: "Air conditioning" },
  { name: "amenityOutdoorSeating", label: "Outdoor seating" },
  { name: "amenityServiceCharge", label: "Service charge" },
] as const

const dietaryAmenityFields = [
  { name: "amenityVegetarian", label: "Vegetarian" },
  { name: "amenityVegan", label: "Vegan" },
  { name: "amenityHalal", label: "Halal" },
] as const

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function readAmenityFlag(record: Record<string, unknown> | undefined, snakeKey: string, camelKey: string) {
  const value = record?.[snakeKey] ?? record?.[camelKey]
  return value === true
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

  // Dialog open state for each picker
  const [logoPickerOpen, setLogoPickerOpen] = useState(false)
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false)
  const [photosPickerOpen, setPhotosPickerOpen] = useState(false)

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "pending",
      establishmentTypeId: "",
      logoId: "",
      bannerId: "",
      photos: [],
      phone: "",
      phoneSecondary: "",
      email: "",
      state: "",
      district: "",
      city: "",
      area: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
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
      amenityEsewa: false,
      amenityKhalti: false,
      amenityQr: false,
      amenityParking: false,
      amenityWifi: false,
      amenityAirConditioning: false,
      amenityOutdoorSeating: false,
      amenityServiceCharge: false,
      amenityVegetarian: false,
      amenityVegan: false,
      amenityHalal: false,
    },
  })

  useEffect(() => {
    if (existing) {
      const a = existing.amenities
      const services = a?.services as Record<string, unknown> | undefined
      const payment = a?.payment as Record<string, unknown> | undefined
      const facilities = a?.facilities as Record<string, unknown> | undefined
      const dietary = a?.dietary as Record<string, unknown> | undefined

      form.reset({
        name: existing.name,
        slug: existing.slug,
        description: existing.description ?? "",
        status: existing.status,
        establishmentTypeId: existing.establishmentTypeId,
        logoId: existing.logo?.id ?? "",
        bannerId: existing.banner?.id ?? "",
        photos: existing.photos?.map((p) => p.id) ?? [],
        phone: existing.phone,
        phoneSecondary: existing.phoneSecondary ?? "",
        email: existing.email ?? "",
        state: existing.state,
        district: existing.district,
        city: existing.city,
        area: existing.area ?? "",
        addressLine1: existing.addressLine1,
        addressLine2: existing.addressLine2 ?? "",
        landmark: existing.landmark ?? "",
        websiteUrl: existing.links?.website ?? "",
        facebookUrl: existing.links?.facebook ?? "",
        instagramUrl: existing.links?.instagram ?? "",
        twitterUrl: existing.links?.twitter ?? "",
        youtubeUrl: existing.links?.youtube ?? "",
        tiktokUrl: existing.links?.tiktok ?? "",
        amenityDineIn: readAmenityFlag(services, "dine_in", "dineIn"),
        amenityTakeaway: readAmenityFlag(services, "takeaway", "takeaway"),
        amenityDelivery: readAmenityFlag(services, "delivery", "delivery"),
        amenityCash: readAmenityFlag(payment, "cash", "cash"),
        amenityCard: readAmenityFlag(payment, "card", "card"),
        amenityEsewa: readAmenityFlag(payment, "esewa", "eSewa"),
        amenityKhalti: readAmenityFlag(payment, "khalti", "khalti"),
        amenityQr: readAmenityFlag(payment, "qr", "qr"),
        amenityParking: readAmenityFlag(facilities, "parking", "parking"),
        amenityWifi: readAmenityFlag(facilities, "wifi", "wifi"),
        amenityAirConditioning: readAmenityFlag(facilities, "air_conditioning", "airConditioning"),
        amenityOutdoorSeating: readAmenityFlag(facilities, "outdoor_seating", "outdoorSeating"),
        amenityServiceCharge: readAmenityFlag(facilities, "service_charge", "serviceCharge"),
        amenityVegetarian: readAmenityFlag(dietary, "vegetarian", "vegetarian"),
        amenityVegan: readAmenityFlag(dietary, "vegan", "vegan"),
        amenityHalal: readAmenityFlag(dietary, "halal", "halal"),
      })
      if (existing.logo) setLogoMedia(existing.logo)
      if (existing.banner) setBannerMedia(existing.banner)
      if (existing.photos?.length) setPhotosMedia(existing.photos)
    }
  }, [existing, form])

  const watchedName = form.watch("name")
  useEffect(() => {
    if (mode === "create") {
      const currentSlug = form.getValues("slug")
      if (!currentSlug || currentSlug === slugify(form.getValues("name").slice(0, -1))) {
        form.setValue("slug", slugify(watchedName), { shouldValidate: false })
      }
    }
  }, [watchedName, form, mode])

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
        esewa: values.amenityEsewa ?? false,
        khalti: values.amenityKhalti ?? false,
        qr: values.amenityQr ?? false,
      },
      facilities: {
        parking: values.amenityParking ?? false,
        wifi: values.amenityWifi ?? false,
        air_conditioning: values.amenityAirConditioning ?? false,
        outdoor_seating: values.amenityOutdoorSeating ?? false,
        service_charge: values.amenityServiceCharge ?? false,
      },
      dietary: {
        vegetarian: values.amenityVegetarian ?? false,
        vegan: values.amenityVegan ?? false,
        halal: values.amenityHalal ?? false,
      },
    }

    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
      establishmentTypeId: values.establishmentTypeId || undefined,
      logoId: values.logoId || undefined,
      bannerId: values.bannerId || undefined,
      photos: values.photos?.length ? values.photos : undefined,
      phone: values.phone,
      phoneSecondary: values.phoneSecondary || undefined,
      email: values.email || undefined,
      links: hasLinks ? links : undefined,
      state: values.state,
      district: values.district,
      city: values.city,
      area: values.area || undefined,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      landmark: values.landmark || undefined,
      amenities,
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

  if (mode === "edit" && isLoadingBusiness) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-brand-deep-green/10" />
        <div className="h-64 animate-pulse rounded-[1.8rem] bg-brand-deep-green/5" />
      </div>
    )
  }

  const breadcrumbLabel = mode === "edit" ? (existing?.name ?? "Edit") : "Add business"
  const existingLogoId = form.watch("logoId")
  const existingBannerId = form.watch("bannerId")
  const existingPhotos = form.watch("photos") ?? []
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Core details */}
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Core details</h2>
                <p className="text-sm text-muted-foreground">The public business identity and admin status.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 border-t border-brand-deep-green/10 pt-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Business name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. The Himalayan Kitchen" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. the-himalayan-kitchen" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      key={`business-status-${existing?.id ?? "create"}-${field.value ?? "empty"}`}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                          <SelectValue placeholder="Choose a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
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
                      key={`est-type-${existing?.id ?? "create"}-${isLoadingTypes ? "loading" : "ready"}-${field.value ?? "empty"}`}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            </div>
          </section>

          {/* Media */}
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Image className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Media</h2>
                <p className="text-sm text-muted-foreground">Logo, banner, and gallery photos for the listing.</p>
              </div>
            </div>

            <div className="mt-6 space-y-6 border-t border-brand-deep-green/10 pt-6">

              {/* Logo */}
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-1.5">
                  <p className="text-sm font-medium text-brand-dark-green">Logo</p>
                  <p className="text-xs text-muted-foreground">Square image — shown as the business avatar in listings.</p>
                </div>
                <div className="flex items-center gap-3">
                  {logoMedia ? (
                    <div className="relative">
                      <img
                        src={logoMedia.publicUrl}
                        alt={logoMedia.altText ?? logoMedia.filename}
                        className="h-16 w-16 rounded-xl border border-brand-deep-green/10 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setLogoMedia(null); form.setValue("logoId", "") }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : existingLogoId ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/30 text-xs text-muted-foreground">
                      Set
                    </div>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
                    onClick={() => setLogoPickerOpen(true)}
                  >
                    {existingLogoId || logoMedia ? "Change" : "Choose logo"}
                  </Button>
                </div>
              </div>

              {/* Banner */}
              <div className="flex items-start gap-4 border-t border-brand-deep-green/10 pt-6">
                <div className="flex-1 space-y-1.5">
                  <p className="text-sm font-medium text-brand-dark-green">Banner</p>
                  <p className="text-xs text-muted-foreground">Wide cover image — shown at the top of the business detail page.</p>
                </div>
                <div className="flex items-center gap-3">
                  {bannerMedia ? (
                    <div className="relative">
                      <img
                        src={bannerMedia.publicUrl}
                        alt={bannerMedia.altText ?? bannerMedia.filename}
                        className="h-16 w-28 rounded-xl border border-brand-deep-green/10 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setBannerMedia(null); form.setValue("bannerId", "") }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : existingBannerId ? (
                    <div className="flex h-16 w-28 items-center justify-center rounded-xl border border-brand-deep-green/10 bg-brand-soft-beige/30 text-xs text-muted-foreground">
                      Set
                    </div>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
                    onClick={() => setBannerPickerOpen(true)}
                  >
                    {existingBannerId || bannerMedia ? "Change" : "Choose banner"}
                  </Button>
                </div>
              </div>

              {/* Photos */}
              <div className="border-t border-brand-deep-green/10 pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-brand-dark-green">Photos</p>
                    <p className="text-xs text-muted-foreground">Gallery images shown on the business page.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
                    onClick={() => setPhotosPickerOpen(true)}
                  >
                    Add photo
                  </Button>
                </div>
                {photosMedia.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {photosMedia.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.publicUrl}
                          alt={photo.altText ?? photo.filename}
                          className="aspect-square w-full rounded-xl border border-brand-deep-green/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-brand-deep-green/10 text-brand-deep-green/60 hover:text-brand-dark-green"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : existingPhotos.length > 0 ? (
                  <p className="text-xs text-muted-foreground">{existingPhotos.length} photo{existingPhotos.length > 1 ? "s" : ""} already set. Add new photos above.</p>
                ) : (
                  <div className="rounded-xl border border-dashed border-brand-deep-green/20 bg-brand-soft-beige/10 px-6 py-6 text-center">
                    <p className="text-sm text-muted-foreground">No photos added yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Contact</h2>
                <p className="text-sm text-muted-foreground">Phone, email, and web presence for the listing.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 border-t border-brand-deep-green/10 pt-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+977 9800000000" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                      <Input {...field} placeholder="+977 9800000001" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="hello@business.com" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> Website
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://example.com" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://facebook.com/..." className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://instagram.com/..." className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>Twitter / X</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://twitter.com/..." className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://youtube.com/..." className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
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
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://tiktok.com/..." className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
            <div className="mt-6 grid gap-4 border-t border-brand-deep-green/10 pt-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Bagmati" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Kathmandu" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Kathmandu" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area / Neighbourhood</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Thamel" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address line 1</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street, building, floor…" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address line 2</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Suite, unit, floor…" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Near the old bus park…" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <p className="text-sm text-muted-foreground">Services, payment options, facilities, and dietary accommodations.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 border-t border-brand-deep-green/10 pt-6">

              {/* Services */}
              <div>
                <p className="mb-3 text-sm font-medium text-brand-dark-green">Services</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                          <FormLabel className="font-normal cursor-pointer">
                            {label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="border-t border-brand-deep-green/10 pt-5">
                <p className="mb-3 text-sm font-medium text-brand-dark-green">Payment</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                          <FormLabel className="font-normal cursor-pointer">
                            {label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="border-t border-brand-deep-green/10 pt-5">
                <p className="mb-3 text-sm font-medium text-brand-dark-green">Facilities</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                          <FormLabel className="font-normal cursor-pointer">
                            {label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Dietary */}
              <div className="border-t border-brand-deep-green/10 pt-5">
                <p className="mb-3 text-sm font-medium text-brand-dark-green">Dietary</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                          <FormLabel className="font-normal cursor-pointer">
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

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
              onClick={() => router.push("/admin/businesses")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
              disabled={isPending}
            >
              {isPending ? "Saving…" : mode === "create" ? "Create business" : "Save changes"}
            </Button>
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
        onSelect={handlePhotoSelect}
      />
    </div>
  )
}

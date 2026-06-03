"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowRight, Building2, CheckCircle2, ClipboardList, ImagePlus, Mail, MapPin, Phone, Store } from "lucide-react"
import { useForm } from "react-hook-form"
import { CITY_METADATA, STATE_OPTIONS, getCityByLabel } from "@/content/taxonomy/city-taxonomy"
import { GoogleMapPicker } from "@/features/business/components/google-map-picker"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { useCreateBusiness } from "@/hooks/use-businesses"
import { useEstablishmentTypes } from "@/hooks/use-establishment-types"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { addBusinessSchema, BUSINESS_ROLE_OPTIONS, type AddBusinessFormValues } from "@/lib/validators/business"
import { cn } from "@/lib/utils"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle } from "@/components/mitho/mitho-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type AddBusinessShell = "public" | "dashboard"

interface AddBusinessFlowProps {
  shell: AddBusinessShell
}

const sectionCardClass = "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"
const inputClassName =
  "h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const textareaClassName =
  "min-h-[118px] rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-12 w-full rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalizeOptionalUrl(value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined
    return data?.message ?? data?.error ?? "Could not submit this business right now."
  }

  return "Could not submit this business right now."
}

function isSlugConflict(error: unknown) {
  if (!axios.isAxiosError(error)) return false
  const status = error.response?.status
  const message = JSON.stringify(error.response?.data ?? "").toLowerCase()
  return (status === 409 || status === 422 || status === 500) && message.includes("slug")
}

function AddBusinessSuccess({
  businessName,
  businessCity,
  shell,
}: {
  businessName: string
  businessCity: string
  shell: AddBusinessShell
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className={sectionCardClass}>
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/12 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <MithoBadge variant="success">Listing created</MithoBadge>
          </div>
          <h1 className="type-page-title mt-5 text-brand-dark-green">Your listing is submitted for admin review.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            <span className="font-semibold text-brand-dark-green">{businessName}</span> has been sent to Mitho for review.
            We will email you after the listing is approved or rejected. Approval makes the listing ready to claim, but it
            does not unlock business dashboard access yet.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Business</p>
              <p className="mt-2 text-lg font-semibold text-brand-dark-green">{businessName}</p>
            </div>
            <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">City</p>
              <p className="mt-2 text-lg font-semibold text-brand-dark-green">{businessCity}</p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-brand-deep-green/10 bg-white p-5">
            <p className="type-eyebrow text-brand-deep-green/68">What happens next</p>
            <ul className="mt-4 space-y-3">
              {[
                "Mitho reviews the submitted listing details.",
                "You receive an email after approval or rejection.",
                "After approval, use the claim flow if you need business management access.",
                "Claim approval is the step that unlocks the business dashboard.",
              ].map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-orange" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <MithoButton asChild size="lg">
              <Link href="/">
                Back to home
                <ArrowRight className="h-5 w-5" />
              </Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" size="lg" asChild>
              <Link href="/explore">Explore places</Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" size="lg" asChild>
              <Link href="/business/claim">Claim an existing business</Link>
            </MithoButton>
          </div>
        </div>
      </section>

      <aside className={cn(sectionCardClass, "h-fit bg-[#fffdf8]")}>
        <div className="px-6 py-6">
          <p className="type-eyebrow text-brand-deep-green/68">
            {shell === "public" ? "Review queue" : "Admin review"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-dark-green">
            Listing approval and business access stay separate.
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Adding a place helps Mitho grow the directory. Claiming a place later proves ownership and opens management tools.
          </p>
        </div>
      </aside>
    </div>
  )
}

export function AddBusinessFlow({ shell }: AddBusinessFlowProps) {
  const { isAuthenticated } = useAuthSnapshot()
  const createBusiness = useCreateBusiness()
  const establishmentTypesQuery = useEstablishmentTypes()
  const form = useForm<AddBusinessFormValues>({
    resolver: zodResolver(addBusinessSchema),
    defaultValues: {
      businessName: "",
      primaryCategory: "",
      shortNote: "",
      state: "Bagmati Province",
      city: "Kathmandu",
      addressLine1: "",
      addressLine2: "",
      latitude: null,
      longitude: null,
      phone: "",
      publicEmail: "",
      website: "",
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      relationshipRole: "owner",
      authorizationConfirmed: shell === "public",
    },
  })

  const [createdListing, setCreatedListing] = useState<{
    businessName: string
    city: string
  } | null>(null)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [pendingSubmission, setPendingSubmission] = useState<AddBusinessFormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const watchedName = form.watch("businessName")
  const watchedCategory = form.watch("primaryCategory")
  const watchedState = form.watch("state")
  const watchedCity = form.watch("city")
  const watchedAddressLine1 = form.watch("addressLine1")
  const watchedAddressLine2 = form.watch("addressLine2")
  const watchedLatitude = form.watch("latitude")
  const watchedLongitude = form.watch("longitude")
  const selectedEstablishmentType = establishmentTypesQuery.data?.find((type) => type.id === watchedCategory)
  const cityOptions = CITY_METADATA.filter((city) => city.state === watchedState).map(({ label }) => label)
  const selectedCity = getCityByLabel(watchedCity) ?? CITY_METADATA[0]
  const markerPosition =
    watchedLatitude !== null && watchedLongitude !== null
      ? { lat: watchedLatitude, lng: watchedLongitude }
      : null
  const mapLocationError =
    form.formState.errors.latitude?.message ?? form.formState.errors.longitude?.message

  useEffect(() => {
    if (cityOptions.length === 0) return
    if (!cityOptions.includes(watchedCity)) {
      form.setValue("city", cityOptions[0], { shouldValidate: true })
    }
  }, [cityOptions, form, watchedCity])

  const submitBusiness = useCallback(async (values: AddBusinessFormValues) => {
    setSubmitError(null)

    const links = {
      website: normalizeOptionalUrl(values.website),
      facebook: normalizeOptionalUrl(values.facebookUrl),
      instagram: normalizeOptionalUrl(values.instagramUrl),
      tiktok: normalizeOptionalUrl(values.tiktokUrl),
    }
    const hasLinks = Object.values(links).some(Boolean)
    const baseSlug = slugify(values.businessName) || "business"

    const payload = {
      name: values.businessName.trim(),
      slug: baseSlug,
      description: values.shortNote?.trim() || undefined,
      phone: values.phone.trim(),
      email: values.publicEmail.trim(),
      state: values.state,
      district: values.city,
      city: values.city,
      addressLine1: values.addressLine1.trim(),
      addressLine2: values.addressLine2?.trim() || undefined,
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
      establishmentTypeId: values.primaryCategory,
      links: hasLinks ? links : undefined,
    }

    try {
      await createBusiness.mutateAsync(payload)
    } catch (error) {
      if (!isSlugConflict(error)) {
        throw error
      }

      await createBusiness.mutateAsync({
        ...payload,
        slug: `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`,
      })
    }

    setCreatedListing({
      businessName: values.businessName.trim(),
      city: values.city,
    })
  }, [createBusiness])

  useEffect(() => {
    if (!isAuthenticated || !pendingSubmission) return

    const values = pendingSubmission
    setPendingSubmission(null)
    void submitBusiness(values)
      .then(() => {
        setIsSignInOpen(false)
      })
      .catch((error) => {
        setSubmitError(getApiErrorMessage(error))
      })
  }, [isAuthenticated, pendingSubmission, submitBusiness])

  async function onSubmit(values: AddBusinessFormValues) {
    if (shell === "public" && !isAuthenticated) {
      setPendingSubmission(values)
      setIsSignInOpen(true)
      return
    }

    try {
      await submitBusiness(values)
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    }
  }

  if (createdListing) {
    return (
      <AddBusinessSuccess
        businessName={createdListing.businessName}
        businessCity={createdListing.city}
        shell={shell}
      />
    )
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <MithoBadge variant="neutral">
                {shell === "public" ? "Start a new business listing" : "Submit a new listing"}
              </MithoBadge>
            </div>
            <h1 className="type-page-title mt-5 text-brand-dark-green">Add the listing first. Mitho reviews it next.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              This first pass only asks for the basics needed to review a new Mitho listing. If it is approved, you can
              use the separate claim flow to verify ownership and unlock management later.
            </p>
          </div>
        </section>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
              <MithoCardHeader>
                <p className="type-eyebrow text-brand-deep-green/68">Business basics</p>
                <MithoCardTitle className="mt-2 text-2xl">Give the listing a clear starting identity.</MithoCardTitle>
              </MithoCardHeader>
              <MithoCardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business name</FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClassName} placeholder="The Himalayan Kitchen" />
                      </FormControl>
                      <FormDescription>Use the public-facing name people would recognize.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="primaryCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={establishmentTypesQuery.isLoading || establishmentTypesQuery.isError}
                        >
                          <FormControl>
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue
                                placeholder={
                                  establishmentTypesQuery.isLoading
                                    ? "Loading categories"
                                    : establishmentTypesQuery.isError
                                      ? "Could not load categories"
                                      : "Choose the closest fit"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {establishmentTypesQuery.data?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {establishmentTypesQuery.isError
                            ? "Refresh the page and try again before submitting the listing."
                            : "Choose the category that best fits the listing today."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short note</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className={cn(textareaClassName, "min-h-[96px]")}
                            placeholder="Optional: a short internal/public note like “Dependable thakali meals near Thamel.”"
                          />
                        </FormControl>
                        <FormDescription>Optional for now. Keep it brief and specific.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </MithoCardContent>
            </MithoCard>

            <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
              <MithoCardHeader>
                <p className="type-eyebrow text-brand-deep-green/68">Location</p>
                <MithoCardTitle className="mt-2 text-2xl">Place the business where people expect to find it.</MithoCardTitle>
              </MithoCardHeader>
              <MithoCardContent className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Choose a state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATE_OPTIONS.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Pick the province/state the listing belongs to.</FormDescription>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Choose a city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cityOptions.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Use the city customers would browse under.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address 1</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={inputClassName}
                            placeholder="Street, lane, building, or landmark"
                          />
                        </FormControl>
                        <FormDescription>The main address line customers need first.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address 2</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={inputClassName}
                            placeholder="Optional: floor, unit, courtyard, or extra cue"
                          />
                        </FormControl>
                        <FormDescription>Optional. Add one more clue if it helps people find you.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <FormLabel>Map marker</FormLabel>
                    <FormDescription>
                      Drop the pin where your business is located.
                    </FormDescription>
                  </div>

                  <GoogleMapPicker
                    cityLabel={selectedCity.label}
                    defaultCenter={selectedCity.center}
                    markerPosition={markerPosition}
                    onSelect={(coordinates) => {
                      form.setValue("latitude", coordinates.lat, { shouldDirty: true, shouldValidate: true })
                      form.setValue("longitude", coordinates.lng, { shouldDirty: true, shouldValidate: true })
                    }}
                  />

                </div>
              </MithoCardContent>
            </MithoCard>

            <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
              <MithoCardHeader>
                <p className="type-eyebrow text-brand-deep-green/68">Contact</p>
                <MithoCardTitle className="mt-2 text-2xl">Add the public contact details people actually use.</MithoCardTitle>
              </MithoCardHeader>
              <MithoCardContent className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary phone</FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClassName} placeholder="+977 1-4234567" />
                      </FormControl>
                      <FormDescription>This should be the number customers would actually call.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className={inputClassName} placeholder="hello@business.com" />
                      </FormControl>
                      <FormDescription>Used for public-facing contact on the listing.</FormDescription>
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
                        <Input {...field} className={inputClassName} placeholder="Optional: https://business.com" />
                      </FormControl>
                      <FormDescription>Optional. Add the main website if you have one.</FormDescription>
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
                        <Input {...field} className={inputClassName} placeholder="Optional: https://facebook.com/yourpage" />
                      </FormControl>
                      <FormDescription>Optional public Facebook page link.</FormDescription>
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
                        <Input {...field} className={inputClassName} placeholder="Optional: https://instagram.com/yourhandle" />
                      </FormControl>
                      <FormDescription>Optional public Instagram profile link.</FormDescription>
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
                        <Input {...field} className={inputClassName} placeholder="Optional: https://tiktok.com/@yourhandle" />
                      </FormControl>
                      <FormDescription>Optional public TikTok profile link.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MithoCardContent>
            </MithoCard>

            {shell === "dashboard" ? (
              <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
                <MithoCardHeader>
                  <p className="type-eyebrow text-brand-deep-green/68">Relationship</p>
                  <MithoCardTitle className="mt-2 text-2xl">Confirm why you are the right person to create it.</MithoCardTitle>
                </MithoCardHeader>
                <MithoCardContent className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="relationshipRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Choose your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BUSINESS_ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>We use this to place the listing into the right management context.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authorizationConfirmed"
                    render={({ field }) => (
                      <FormItem className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-4">
                        <div className="flex items-start gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked === true)}
                              className="mt-1 border-brand-deep-green/20"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel>I am allowed to create and manage this business listing.</FormLabel>
                            <FormDescription>
                              This confirms that you own the business, manage it, or have permission to act on its behalf.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </MithoCardContent>
              </MithoCard>
            ) : null}

            <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
              <MithoCardHeader>
                <p className="type-eyebrow text-brand-deep-green/68">Submit and continue</p>
                <MithoCardTitle className="mt-2 text-2xl">Submit the listing for Mitho review.</MithoCardTitle>
              </MithoCardHeader>
              <MithoCardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    After you submit, Mitho will review the listing before it goes live. This step does not create
                    dashboard access; ownership is verified later through the separate claim flow.
                  </p>
                </div>

                {submitError ? (
                  <div className="rounded-[1.15rem] border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                    {submitError}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <MithoButton type="submit" size="lg" loading={form.formState.isSubmitting || createBusiness.isPending}>
                    Create business listing
                  </MithoButton>
                  {shell === "dashboard" ? (
                    <MithoButton variant="outline-secondary" size="lg" asChild>
                      <Link href="/dashboard/businesses">Back to manage businesses</Link>
                    </MithoButton>
                  ) : null}
                </div>
              </MithoCardContent>
            </MithoCard>
          </form>
        </Form>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
        <MithoCard surface="customer" interactive="none" className={cn(sectionCardClass, "bg-[#fffdf8]")}>
          <MithoCardHeader>
            <p className="type-eyebrow text-brand-deep-green/68">Listing preview</p>
            <MithoCardTitle className="mt-2 text-2xl">
              {watchedName.trim() || "Your new business listing"}
            </MithoCardTitle>
          </MithoCardHeader>
          <MithoCardContent className="space-y-4">
            <div className="rounded-[1.15rem] border border-brand-deep-green/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Category</p>
                  <p className="mt-1 text-sm font-semibold text-brand-dark-green">
                    {selectedEstablishmentType?.label ?? "Choose the primary category"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-brand-deep-green/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Location</p>
                  <p className="mt-1 text-sm font-semibold text-brand-dark-green">
                    {watchedAddressLine1.trim()
                      ? `${watchedAddressLine1}${(watchedAddressLine2 ?? "").trim() ? `, ${watchedAddressLine2}` : ""}, ${watchedCity}`
                      : `${watchedCity}, ${watchedState}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {markerPosition
                      ? `Map pin: ${markerPosition.lat.toFixed(6)}, ${markerPosition.lng.toFixed(6)}`
                      : "Map pin still needed before submission"}
                  </p>
                </div>
              </div>
            </div>
          </MithoCardContent>
        </MithoCard>

        <MithoCard surface="customer" interactive="none" className={sectionCardClass}>
          <MithoCardHeader>
            <p className="type-eyebrow text-brand-deep-green/68">What this page includes</p>
            <MithoCardTitle className="mt-2 text-2xl">Only the core fields for now.</MithoCardTitle>
          </MithoCardHeader>
          <MithoCardContent className="space-y-4">
            <ul className="space-y-3">
              {[
                { icon: Building2, label: "Business identity and category" },
                { icon: MapPin, label: "State, city, address, and exact map pin" },
                { icon: Phone, label: "Public contact basics" },
                { icon: Mail, label: shell === "dashboard" ? "One ownership/authorization check" : "A quick first submission, not the full setup" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <item.icon className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-[1.15rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-brand-orange" />
                <p className="text-sm font-semibold text-brand-dark-green">Review happens after submission</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <MithoBadge variant="neutral">Admin review</MithoBadge>
                <MithoBadge variant="neutral">Email update</MithoBadge>
                <MithoBadge variant="neutral">Claim later</MithoBadge>
                <MithoBadge variant="neutral">Access after approval</MithoBadge>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-brand-deep-green/10 bg-white p-4">
              <div className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-brand-orange" />
                <p className="text-sm font-semibold text-brand-dark-green">Not collected in this first step</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Hours, photos, menus, and richer profile setup stay out of this page on purpose so the first submission
                stays fast and low-friction.
              </p>
            </div>
          </MithoCardContent>
        </MithoCard>
        </aside>
      </div>

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        title="Sign in to submit this new business listing."
        description="Use Google so Mitho can tie this listing submission to the same account you use for reviews, shortlists, and future business actions."
        helperCopy="You can finish the listing form first. Once sign-in completes, Mitho will submit this draft without making you re-enter the details."
        stayOnCurrentPageAfterSignIn
        onContinue={() => {
          setIsSignInOpen(false)
        }}
      />
    </>
  )
}

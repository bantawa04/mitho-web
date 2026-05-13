"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Building2, CheckCircle2, ClipboardList, ImagePlus, Mail, MapPin, Phone, ShieldCheck, Store } from "lucide-react"
import { useForm } from "react-hook-form"
import { CATEGORY_OPTIONS } from "@/components/categories/category-taxonomy"
import { CITY_METADATA, STATE_OPTIONS } from "@/components/cities/city-taxonomy"
import { buildNewListingPreviewId } from "@/components/dashboard/dashboard-business-data"
import { addBusinessSchema, BUSINESS_ROLE_OPTIONS, type AddBusinessFormValues } from "@/lib/validators/business"
import { cn } from "@/lib/utils"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle } from "@/components/ui/mitho-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type AddBusinessShell = "public" | "dashboard"

interface AddBusinessFlowProps {
  shell: AddBusinessShell
}

const nextSteps = [
  "Finish business info so the listing feels credible.",
  "Add opening hours before people make the trip.",
  "Upload photos so the page becomes easier to trust.",
  "Prepare the listing for its first customer reviews.",
] as const

const sectionCardClass = "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"
const inputClassName =
  "h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const textareaClassName =
  "min-h-[118px] rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-12 w-full rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

function titleCaseFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function AddBusinessSuccess({
  businessName,
  businessCity,
  workspaceHref,
  shell,
}: {
  businessName: string
  businessCity: string
  workspaceHref: string
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
          <h1 className="type-page-title mt-5 text-brand-dark-green">Your listing is ready for setup.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            <span className="font-semibold text-brand-dark-green">{businessName}</span> has been added under your Mitho
            account. The initial record is in place, and the next step is finishing the details that make the page
            easier for people to trust.
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
              {nextSteps.map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-orange" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <MithoButton asChild size="lg">
              <Link href={workspaceHref}>
                Open business workspace
                <ArrowRight className="h-5 w-5" />
              </Link>
            </MithoButton>
            {shell === "dashboard" ? (
              <MithoButton variant="outline-secondary" size="lg" asChild>
                <Link href="/dashboard/businesses">Back to manage businesses</Link>
              </MithoButton>
            ) : null}
          </div>
        </div>
      </section>

      <aside className={cn(sectionCardClass, "h-fit bg-[#fffdf8]")}>
        <div className="px-6 py-6">
          <p className="type-eyebrow text-brand-deep-green/68">
            {shell === "public" ? "Business mode unlocked" : "Workspace handoff"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-dark-green">
            The same account now has a business workspace too.
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            You still review and browse as the same person. This listing simply adds a new business context to manage.
          </p>
        </div>
      </aside>
    </div>
  )
}

export function AddBusinessFlow({ shell }: AddBusinessFlowProps) {
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
    workspaceHref: string
  } | null>(null)

  const watchedName = form.watch("businessName")
  const watchedCategory = form.watch("primaryCategory")
  const watchedState = form.watch("state")
  const watchedCity = form.watch("city")
  const watchedAddressLine1 = form.watch("addressLine1")
  const watchedAddressLine2 = form.watch("addressLine2")
  const watchedRole = form.watch("relationshipRole")
  const cityOptions = CITY_METADATA.filter((city) => city.state === watchedState).map(({ label }) => label)

  useEffect(() => {
    if (cityOptions.length === 0) return
    if (!cityOptions.includes(watchedCity)) {
      form.setValue("city", cityOptions[0], { shouldValidate: true })
    }
  }, [cityOptions, form, watchedCity])

  function onSubmit(values: AddBusinessFormValues) {
    const previewId = buildNewListingPreviewId(values.businessName)
    setCreatedListing({
      businessName: values.businessName.trim(),
      city: values.city,
      workspaceHref: `/dashboard/businesses/${previewId}/overview`,
    })
  }

  if (createdListing) {
    return (
      <AddBusinessSuccess
        businessName={createdListing.businessName}
        businessCity={createdListing.city}
        workspaceHref={createdListing.workspaceHref}
        shell={shell}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <MithoBadge variant="neutral">
                {shell === "public" ? "Start a new business listing" : "Create a new workspace"}
              </MithoBadge>
            </div>
            <h1 className="type-page-title mt-5 text-brand-dark-green">Add the listing first. Finish the polish after.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              This first pass only asks for the basics needed to create a manageable Mitho listing. Hours, photos, and
              deeper profile work come right after inside the business workspace.
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Choose the closest fit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the category that best fits the listing today.</FormDescription>
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
                <MithoCardTitle className="mt-2 text-2xl">Create the listing, then finish setup in the workspace.</MithoCardTitle>
              </MithoCardHeader>
              <MithoCardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    After you submit, Mitho will create the listing shell first. The next screen will point you into the
                    business workspace for hours, photos, and fuller profile polish.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <MithoButton type="submit" size="lg" loading={form.formState.isSubmitting}>
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
                    {watchedCategory ? titleCaseFromSlug(watchedCategory) : "Choose the primary category"}
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
                      ? `${watchedAddressLine1}${watchedAddressLine2.trim() ? `, ${watchedAddressLine2}` : ""}, ${watchedCity}`
                      : `${watchedCity}, ${watchedState}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-brand-deep-green/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Role</p>
                  <p className="mt-1 text-sm font-semibold text-brand-dark-green">{titleCaseFromSlug(watchedRole)}</p>
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
                { icon: MapPin, label: "State, city, and address lines" },
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
                <p className="text-sm font-semibold text-brand-dark-green">Next setup happens after creation</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <MithoBadge variant="neutral">Business info</MithoBadge>
                <MithoBadge variant="neutral">Hours</MithoBadge>
                <MithoBadge variant="neutral">Photos</MithoBadge>
                <MithoBadge variant="neutral">Review readiness</MithoBadge>
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
  )
}

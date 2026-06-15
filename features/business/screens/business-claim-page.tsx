"use client"

import Link from "next/link"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CheckCircle2, FileBadge2, Search, ShieldCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useClaimableBusiness, useClaimableBusinesses, useCreateBusinessClaim } from "@/hooks/use-business-claims"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { getPublicBusinessHref } from "@/lib/business-public-href"
import {
  claimRoleOptions,
  businessClaimSchema,
  type BusinessClaimFormInputValues,
  type BusinessClaimFormValues,
} from "@/lib/validators/business-claim"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { cn } from "@/lib/utils"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { confirmClaimDocumentUpload, requestClaimDocumentUpload } from "@/lib/api/business-claims"
import { uploadFileToR2 } from "@/lib/api/media"
import type { ClaimableBusiness } from "@/types/business-claims"

const sectionCardClass =
  "rounded-xl border border-border bg-white shadow-sm"
const inputClassName =
  "h-12 rounded-lg border-border bg-white px-4 shadow-none focus-visible:border-primary focus-visible:ring-primary/25"
const selectTriggerClassName =
  "h-12 w-full rounded-lg border-border bg-white px-4 text-sm shadow-none focus-visible:border-primary focus-visible:ring-primary/25"

function claimableLocation(business: ClaimableBusiness) {
  return [
    business.area,
    business.nearestLandmark ? `Near ${business.nearestLandmark}` : undefined,
    business.addressNote,
    business.municipality,
    business.district,
    business.province,
  ]
    .filter(Boolean)
    .join(", ")
}

function claimableCue(business: ClaimableBusiness) {
  const cuisines = business.cuisines?.length ? business.cuisines.join(", ") : null
  if (cuisines && business.establishmentType) {
    return `${business.establishmentType} serving ${cuisines}.`
  }
  if (business.establishmentType) {
    return `${business.establishmentType} listing available to claim.`
  }
  return "This published listing is available to claim after ownership verification."
}

function hasPublicBusinessPage(business: ClaimableBusiness) {
  return Boolean(getPublicBusinessHref(business))
}

function StepPill({
  number,
  title,
  active,
  complete,
}: {
  number: number
  title: string
  active?: boolean
  complete?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-colors",
        complete
          ? "border-success/20 bg-success/10 text-success"
          : active
            ? "border-brand-orange/20 bg-brand-orange/10 text-brand-dark-green"
            : "border-brand-deep-green/10 bg-white text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
          complete
            ? "bg-success text-white"
            : active
              ? "bg-brand-orange text-white"
              : "bg-brand-soft-beige text-brand-dark-green",
        )}
      >
        {complete ? "✓" : number}
      </span>
      <span className="font-semibold">{title}</span>
    </div>
  )
}

function SearchResultCard({
  business,
  selected,
  onSelect,
}: {
  business: ClaimableBusiness
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full border-b border-border last:border-0 text-left hover:bg-muted px-4 py-3",
        selected ? "border-l-2 border-l-primary bg-primary/5" : null,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MithoBadge variant="neutral">{business.establishmentType || "Business"}</MithoBadge>
            <MithoBadge variant="muted">Listing exists on Mitho</MithoBadge>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-brand-dark-green">{business.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{claimableLocation(business)}</p>
        </div>
        <span className="text-sm font-semibold text-brand-deep-green">{selected ? "Selected" : "Choose listing"}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{claimableCue(business)}</p>
    </button>
  )
}

function ClaimSubmittedState({ business }: { business: ClaimableBusiness }) {
  const publicHref = getPublicBusinessHref(business)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className={sectionCardClass}>
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/12 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <MithoBadge variant="success">Claim submitted</MithoBadge>
          </div>
          <h1 className="type-page-title mt-5 text-brand-dark-green">Your ownership claim is now under review.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            We have everything needed to review your request for <span className="font-semibold text-brand-dark-green">{business.name}</span>. We will email you when the claim is approved or rejected.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          <div className="rounded-lg border border-info/25 bg-info/5 px-4 py-3">
            <p className="type-eyebrow text-brand-deep-green/68">Verification note</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Your PAN/VAT document is used only for ownership verification. It is not part of the public business profile and will not be treated like normal business media.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <MithoButton asChild>
              <Link href="/">
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MithoButton>
            {publicHref ? (
              <MithoButton variant="outline-secondary" asChild>
                <Link href={publicHref}>View public listing</Link>
              </MithoButton>
            ) : null}
          </div>
        </div>
      </section>

      <aside className={cn(sectionCardClass, "h-fit bg-surface-soft")}>
        <div className="px-6 py-6">
          <p className="type-eyebrow text-brand-deep-green/68">What happens next</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-dark-green">Admin verifies ownership before dashboard access is unlocked.</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Your claim joins a separate admin review queue.</li>
            <li>Approval grants management access to the business workspace.</li>
            <li>Rejection also triggers an email so the next step is clear.</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

export function BusinessClaimPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthSnapshot()
  const prefilledListingId = searchParams.get("listing")

  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebouncedValue(query, 300)
  const [selectedBusiness, setSelectedBusiness] = React.useState<ClaimableBusiness | null>(null)
  const [step, setStep] = React.useState<1 | 2>(prefilledListingId ? 2 : 1)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingSubmission, setPendingSubmission] = React.useState<BusinessClaimFormValues | null>(null)
  const [submittedBusiness, setSubmittedBusiness] = React.useState<ClaimableBusiness | null>(null)
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const claimableBusinesses = useClaimableBusinesses(debouncedQuery)
  const selectedBusinessQuery = useClaimableBusiness(prefilledListingId)
  const createClaim = useCreateBusinessClaim()

  const form = useForm<BusinessClaimFormInputValues, unknown, BusinessClaimFormValues>({
    resolver: zodResolver(businessClaimSchema),
    defaultValues: {
      claimantName: "",
      role: "owner",
      businessPhone: "",
      businessEmail: "",
      panVatNumber: "",
      verificationDocument: null,
      authorizationConfirmed: false,
    },
  })

  React.useEffect(() => {
    if (selectedBusinessQuery.data) {
      setSelectedBusiness(selectedBusinessQuery.data)
      setStep(2)
      return
    }

    if (prefilledListingId === null && submittedBusiness === null) {
      setStep(1)
    }
  }, [prefilledListingId, selectedBusinessQuery.data, submittedBusiness])

  React.useEffect(() => {
    if (!isAuthenticated || !pendingSubmission || !selectedBusiness) return
    const values = pendingSubmission
    setPendingSubmission(null)
    setIsSignInOpen(false)
    void submitClaim(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pendingSubmission, selectedBusiness])

  const results = claimableBusinesses.data ?? []

  const updateListingParam = (listingId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (listingId) {
      params.set("listing", listingId)
    } else {
      params.delete("listing")
    }
    const nextQuery = params.toString()
    router.replace(nextQuery ? `/business/claim?${nextQuery}` : "/business/claim", { scroll: false })
  }

  const handleSelectBusiness = (business: ClaimableBusiness) => {
    setSelectedBusiness(business)
    setStep(2)
    updateListingParam(business.id)
  }

  const handleChangeBusiness = () => {
    setStep(1)
  }

  async function submitClaim(values: BusinessClaimFormValues) {
    if (!selectedBusiness) return
    setSubmissionError(null)

    try {
      const file = values.verificationDocument
      const ticket = await requestClaimDocumentUpload({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      })
      await uploadFileToR2(ticket.uploadUrl, file)
      const document = await confirmClaimDocumentUpload(ticket.media.id)
      await createClaim.mutateAsync({
        businessId: selectedBusiness.id,
        payload: {
          claimantName: values.claimantName,
          role: values.role,
          businessPhone: values.businessPhone,
          businessEmail: values.businessEmail,
          panVatNumber: values.panVatNumber,
          documentMediaIds: [document.id],
        },
      })
      setSubmittedBusiness(selectedBusiness)
    } catch {
      setSubmissionError("We could not submit this claim. Please check the document and try again.")
    }
  }

  const onSubmit = async (values: BusinessClaimFormValues) => {
    if (!selectedBusiness) return

    if (!isAuthenticated) {
      setPendingSubmission(values)
      setIsSignInOpen(true)
      return
    }

    await submitClaim(values)
  }

  if (submittedBusiness) {
    return (
      <div className="page-shell-customer min-h-screen">
        <Header />
        <main className="pb-16">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <ClaimSubmittedState business={submittedBusiness} />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="pb-16">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className={sectionCardClass}>
                <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <MithoBadge variant="neutral">Claim business</MithoBadge>
                    <MithoBadge variant="muted">Ownership verification</MithoBadge>
                  </div>
                  <h1 className="type-page-title mt-5 text-brand-dark-green">Claim an existing Mitho listing and verify that you are allowed to manage it.</h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                    Start by choosing the business, then submit the basic ownership details and PAN/VAT document our admin team needs for verification. Dashboard access only opens after the claim is approved.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 px-6 py-6 sm:px-8">
                  <StepPill number={1} title="Find listing" active={step === 1} complete={step === 2 || submittedBusiness !== null} />
                  <StepPill number={2} title="Verify ownership" active={step === 2} />
                </div>
              </section>

              {step === 1 ? (
                <section className={sectionCardClass}>
                  <div className="px-6 py-6 sm:px-8">
                    <p className="type-eyebrow text-brand-deep-green/68">Step 1</p>
                    <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Find the business listing you want to claim.</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Search by business name. You can browse available listings before signing in.
                    </p>

                    <div className="relative mt-5">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className={cn(inputClassName, "pl-11")}
                        placeholder="Search business by name"
                      />
                    </div>

                    <div className="mt-6 grid gap-4">
                      {query.trim().length >= 2 && (claimableBusinesses.isLoading || debouncedQuery !== query) ? (
                        <div className="rounded-lg border border-brand-deep-green/10 bg-surface-soft p-5">
                          <p className="text-base font-semibold text-brand-dark-green">Searching listings...</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">Checking claimable businesses by name.</p>
                        </div>
                      ) : query.trim().length >= 2 && claimableBusinesses.isError ? (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
                          <p className="text-base font-semibold text-destructive">Could not search listings.</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">Please try again in a moment.</p>
                        </div>
                      ) : query.trim().length >= 2 && results.length > 0 ? (
                        results.map((business) => (
                          <SearchResultCard
                            key={business.id}
                            business={business}
                            selected={selectedBusiness?.id === business.id}
                            onSelect={() => handleSelectBusiness(business)}
                          />
                        ))
                      ) : query.trim().length >= 2 ? (
                        <div className="rounded-lg border border-brand-deep-green/10 bg-surface-soft p-5">
                          <p className="text-base font-semibold text-brand-dark-green">No matching listings yet.</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Try another name or area. If the business is not on Mitho yet, the add-business flow is the better path.
                          </p>
                          <MithoButton variant="outline-secondary" className="mt-4" asChild>
                            <Link href="/add-business">Add a new listing instead</Link>
                          </MithoButton>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : (
                <section className={sectionCardClass}>
                  <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={handleChangeBusiness}
                          className="mb-6 inline-flex items-center text-sm font-semibold text-brand-deep-green transition-colors hover:text-primary"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to search
                        </button>
                        <p className="type-eyebrow text-brand-deep-green/68">Step 2</p>
                        <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Verify that you are allowed to claim this listing.</h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          PAN/VAT is used only for verification. It is reviewed by admin and does not become public listing media.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-8">
                    {!selectedBusiness ? (
                      <div className="rounded-lg border border-brand-deep-green/10 bg-surface-soft p-5">
                        <p className="text-base font-semibold text-brand-dark-green">
                          {selectedBusinessQuery.isLoading ? "Loading selected listing..." : "This listing is not available to claim."}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          It may already be claimed, under review, or unpublished. Search again to choose another listing.
                        </p>
                        <MithoButton className="mt-4" type="button" variant="outline-secondary" onClick={handleChangeBusiness}>
                          Back to listing search
                        </MithoButton>
                      </div>
                    ) : (
                    <Form {...form}>
                      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-5 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="claimantName"
                            render={({ field }) => (
                              <FormItem>
                                <RequiredLabel>Claimant name</RequiredLabel>
                                <FormControl>
                                  <Input {...field} className={inputClassName} placeholder="Your full name" />
                                </FormControl>
                                <FormDescription>The person responsible for this verification request.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <RequiredLabel>Your role</RequiredLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className={selectTriggerClassName}>
                                      <SelectValue placeholder="Choose your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {claimRoleOptions.map((role) => (
                                      <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>Tell us how you are connected to the business.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="businessPhone"
                            render={({ field }) => (
                              <FormItem>
                                <RequiredLabel>Business phone</RequiredLabel>
                                <FormControl>
                                  <Input {...field} className={inputClassName} placeholder="+977 1-4234567" />
                                </FormControl>
                                <FormDescription>The main business number tied to this listing.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessEmail"
                            render={({ field }) => (
                              <FormItem>
                                <RequiredLabel>Business email</RequiredLabel>
                                <FormControl>
                                  <Input {...field} type="email" className={inputClassName} placeholder="hello@business.com" />
                                </FormControl>
                                <FormDescription>Use the business email that should be associated with the claim.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="panVatNumber"
                            render={({ field }) => (
                              <FormItem>
                                <RequiredLabel>PAN/VAT number</RequiredLabel>
                                <FormControl>
                                  <Input {...field} className={inputClassName} placeholder="Enter the PAN/VAT number" />
                                </FormControl>
                                <FormDescription>This is checked only for ownership verification.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="verificationDocument"
                            render={({ field: { onChange, value, ...field } }) => (
                              <FormItem>
                                <RequiredLabel>PAN/VAT document</RequiredLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="file"
                                    accept=".pdf,image/*"
                                    className={cn(inputClassName, "rounded-lg border-dashed border-border bg-white pt-2")}
                                    onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                                  />
                                </FormControl>
                                <FormDescription>Upload a PDF or image used only for admin verification.</FormDescription>
                                {value instanceof File ? (
                                  <p aria-live="polite" className="text-sm font-medium text-[#15803d]">Selected: {value.name}</p>
                                ) : null}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="authorizationConfirmed"
                          render={({ field }) => (
                            <FormItem className="pt-2">
                              <div className="flex items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                    className="mt-1 border-brand-deep-green/20"
                                  />
                                </FormControl>
                                <div className="space-y-1">
                                  <RequiredLabel>I am allowed to claim and manage this business listing.</RequiredLabel>
                                  <FormDescription>
                                    I understand Mitho will review this request before any business dashboard access is granted.
                                  </FormDescription>
                                  <FormMessage />
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="pt-4">
                          <MithoButton type="submit" loading={form.formState.isSubmitting}>
                            {isAuthenticated ? "Submit claim for review" : "Sign in to submit claim"}
                            <ArrowRight className="h-4 w-4" />
                          </MithoButton>
                        </div>
                        {submissionError ? (
                          <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                            {submissionError}
                          </p>
                        ) : null}
                      </form>
                    </Form>
                    )}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <section className={cn(sectionCardClass, "bg-surface-soft")}>
                <div className="px-6 py-6">
                  <p className="type-eyebrow text-brand-deep-green/68">Why this step exists</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-dark-green">Claiming is how management access is unlocked.</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Adding a listing and claiming a listing are different product paths. This verification step is what connects an existing public listing to the business workspace after admin approval.
                  </p>
                </div>
              </section>

              <section className={sectionCardClass}>
                <div className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deep-green/10 text-brand-deep-green">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-brand-dark-green">What admin reviews</p>
                      <p className="mt-1 text-sm text-muted-foreground">A short, separate verification pass.</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>Matched listing and claimant details</li>
                    <li>PAN/VAT number and uploaded verification file</li>
                    <li>Whether the requester is allowed to act on behalf of the business</li>
                  </ul>
                </div>
              </section>

              {selectedBusiness ? (
                <section className={sectionCardClass}>
                  <div className="px-6 py-6">
                    <p className="type-eyebrow text-brand-deep-green/68">Current selection</p>
                    <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">{selectedBusiness.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{claimableLocation(selectedBusiness)}</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{claimableCue(selectedBusiness)}</p>
                    {(() => {
                      const publicHref = getPublicBusinessHref(selectedBusiness)
                      return publicHref ? (
                        <MithoButton variant="ghost" className="mt-4" asChild>
                          <Link href={publicHref}>View public listing</Link>
                        </MithoButton>
                      ) : null
                    })()}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        title="Sign in to continue your business claim."
        description="Use Google so Mitho can tie this ownership request to the same account you use for reviews, listings, and future business management."
        helperCopy="You can browse and choose the listing first. We only ask you to sign in when you are ready to submit the claim for admin review."
        onContinue={() => {
          setIsSignInOpen(false)
        }}
      />
    </div>
  )
}

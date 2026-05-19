"use client"

import Link from "next/link"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CheckCircle2, FileBadge2, Search, ShieldCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useMockAuth } from "@/components/auth/mock-auth-provider"
import { CLAIMABLE_BUSINESSES, getClaimableBusinessById, type ClaimableBusiness } from "@/components/business/business-claim-data"
import { GoogleSignInDialog } from "@/components/auth/google-sign-in-dialog"
import { claimRoleOptions, businessClaimSchema, type BusinessClaimFormValues } from "@/lib/validators/business-claim"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { cn } from "@/lib/utils"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sectionCardClass =
  "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"
const inputClassName =
  "h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-12 w-full rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

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
        "w-full rounded-[1.35rem] border p-5 text-left transition-all duration-200",
        selected
          ? "border-brand-orange/30 bg-brand-soft-beige/45 shadow-[0_14px_32px_rgba(239,138,0,0.10)]"
          : "border-brand-deep-green/10 bg-white hover:border-brand-deep-green/18 hover:shadow-[0_12px_26px_rgba(10,70,53,0.06)]",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MithoBadge variant="neutral">{business.category}</MithoBadge>
            <MithoBadge variant="muted">Listing exists on Mitho</MithoBadge>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-brand-dark-green">{business.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{business.location}</p>
        </div>
        <span className="text-sm font-semibold text-brand-deep-green">{selected ? "Selected" : "Choose listing"}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{business.cue}</p>
    </button>
  )
}

function ClaimSubmittedState({ business }: { business: ClaimableBusiness }) {
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
          <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
            <p className="type-eyebrow text-brand-deep-green/68">Verification note</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Your PAN/VAT document is used only for ownership verification. It is not part of the public business profile and will not be treated like normal business media.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <MithoButton asChild>
              <Link href="/dashboard/businesses">
                Manage businesses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" asChild>
              <Link href={business.publicHref}>View public listing</Link>
            </MithoButton>
          </div>
        </div>
      </section>

      <aside className={cn(sectionCardClass, "h-fit bg-[#fffdf8]")}>
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
  const { isAuthenticated, signIn } = useMockAuth()
  const prefilledListingId = searchParams.get("listing")
  const prefilledBusiness = getClaimableBusinessById(prefilledListingId)

  const [query, setQuery] = React.useState("")
  const [selectedBusiness, setSelectedBusiness] = React.useState<ClaimableBusiness | null>(prefilledBusiness)
  const [step, setStep] = React.useState<1 | 2>(prefilledBusiness ? 2 : 1)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingSubmission, setPendingSubmission] = React.useState<BusinessClaimFormValues | null>(null)
  const [submittedBusiness, setSubmittedBusiness] = React.useState<ClaimableBusiness | null>(null)

  const form = useForm<BusinessClaimFormValues>({
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
    const nextBusiness = getClaimableBusinessById(prefilledListingId)
    if (nextBusiness) {
      setSelectedBusiness(nextBusiness)
      setStep(2)
      return
    }

    if (prefilledListingId === null && submittedBusiness === null) {
      setStep(1)
    }
  }, [prefilledListingId, submittedBusiness])

  React.useEffect(() => {
    if (!isAuthenticated || !pendingSubmission || !selectedBusiness) return
    setSubmittedBusiness(selectedBusiness)
    setPendingSubmission(null)
    setIsSignInOpen(false)
  }, [isAuthenticated, pendingSubmission, selectedBusiness])

  const results = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return CLAIMABLE_BUSINESSES

    return CLAIMABLE_BUSINESSES.filter((business) =>
      [business.name, business.location, business.category].some((value) => value.toLowerCase().includes(normalized)),
    )
  }, [query])

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

  const onSubmit = (values: BusinessClaimFormValues) => {
    if (!selectedBusiness) return

    if (!isAuthenticated) {
      setPendingSubmission(values)
      setIsSignInOpen(true)
      return
    }

    setSubmittedBusiness(selectedBusiness)
  }

  if (submittedBusiness) {
    return (
      <div className="page-shell-customer min-h-screen">
        <Header />
        <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
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

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
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
                      Search by business name, area, or category. You can browse available listings before signing in.
                    </p>

                    <div className="relative mt-5">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className={cn(inputClassName, "pl-11")}
                        placeholder="Search existing listings"
                      />
                    </div>

                    <div className="mt-6 grid gap-4">
                      {results.length > 0 ? (
                        results.map((business) => (
                          <SearchResultCard
                            key={business.id}
                            business={business}
                            selected={selectedBusiness?.id === business.id}
                            onSelect={() => handleSelectBusiness(business)}
                          />
                        ))
                      ) : (
                        <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
                          <p className="text-base font-semibold text-brand-dark-green">No matching listings yet.</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Try another name or area. If the business is not on Mitho yet, the add-business flow is the better path.
                          </p>
                          <MithoButton variant="outline-secondary" className="mt-4" asChild>
                            <Link href="/add-business">Add a new listing instead</Link>
                          </MithoButton>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
                <section className={sectionCardClass}>
                  <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="type-eyebrow text-brand-deep-green/68">Step 2</p>
                        <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Verify that you are allowed to claim this listing.</h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          PAN/VAT is used only for verification. It is reviewed by admin and does not become public listing media.
                        </p>
                      </div>

                      {selectedBusiness ? (
                        <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Selected listing</p>
                          <p className="mt-2 text-base font-semibold text-brand-dark-green">{selectedBusiness.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{selectedBusiness.location}</p>
                          <button
                            type="button"
                            onClick={handleChangeBusiness}
                            className="mt-3 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
                          >
                            Change business
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-8">
                    <Form {...form}>
                      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-5 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="claimantName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Claimant name</FormLabel>
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
                                <FormLabel>Your role</FormLabel>
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
                                <FormLabel>Business phone</FormLabel>
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
                                <FormLabel>Business email</FormLabel>
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
                                <FormLabel>PAN/VAT number</FormLabel>
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
                                <FormLabel>PAN/VAT document</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="file"
                                    accept=".pdf,image/*"
                                    className={cn(inputClassName, "pt-2")}
                                    onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                                  />
                                </FormControl>
                                <FormDescription>Upload a PDF or image used only for admin verification.</FormDescription>
                                {value instanceof File ? (
                                  <p className="text-sm font-medium text-brand-dark-green">Selected: {value.name}</p>
                                ) : null}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                              <FileBadge2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-base font-semibold text-brand-dark-green">Verification-only document handling</p>
                              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                This file is used only to confirm ownership. It is reviewed separately from listing approval and is not displayed on the public business page.
                              </p>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="authorizationConfirmed"
                          render={({ field }) => (
                            <FormItem className="rounded-[1.25rem] border border-brand-deep-green/10 bg-white px-4 py-4">
                              <div className="flex items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                    className="mt-1 border-brand-deep-green/20"
                                  />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel>I am allowed to claim and manage this business listing.</FormLabel>
                                  <FormDescription>
                                    I understand Mitho will review this request before any business dashboard access is granted.
                                  </FormDescription>
                                  <FormMessage />
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-wrap gap-3">
                          <MithoButton type="button" variant="outline-secondary" onClick={handleChangeBusiness}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to listing search
                          </MithoButton>
                          <MithoButton type="submit" loading={form.formState.isSubmitting}>
                            {isAuthenticated ? "Submit claim for review" : "Sign in to submit claim"}
                            <ArrowRight className="h-4 w-4" />
                          </MithoButton>
                        </div>
                      </form>
                    </Form>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <section className={cn(sectionCardClass, "bg-[#fffdf8]")}>
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
                    <p className="mt-2 text-sm text-muted-foreground">{selectedBusiness.location}</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{selectedBusiness.cue}</p>
                    <MithoButton variant="ghost" className="mt-4" asChild>
                      <Link href={selectedBusiness.publicHref}>View public listing</Link>
                    </MithoButton>
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
          signIn()
          setIsSignInOpen(false)
        }}
      />
    </div>
  )
}

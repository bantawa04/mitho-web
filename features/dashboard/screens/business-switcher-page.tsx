"use client"

import Link from "next/link"
import { Building2, CirclePlus, FileCheck2, LayoutDashboard, Loader2, MoveRight, ShieldCheck } from "lucide-react"
import type { MyBusinessEntry } from "@/types/business"
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useMyBusinesses } from "@/hooks/use-businesses"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import type { ManagedBusiness } from "@/features/dashboard/data/dashboard-business-data"
import { getPublicBusinessHref } from "@/lib/business-public-href"



function deriveManagedStatus(entry: MyBusinessEntry): ManagedBusiness["status"] {
  if (entry.claimStatus === "pending") return "claim-pending"
  if (entry.membershipRole) {
    const listingStatus = entry.business.listingStatus
    if (listingStatus === "published") return "active"
    return "setup-needed"
  }
  return "setup-needed"
}

function deriveLifecycleStatus(entry: MyBusinessEntry): ManagedBusiness["lifecycleStatus"] {
  const ownershipStatus = entry.business.ownershipStatus
  const listingStatus = entry.business.listingStatus
  if (ownershipStatus === "unclaimed") return "unclaimed"
  if (listingStatus === "suspended") return "temporarily_closed"
  if (listingStatus === "rejected") return "permanently_closed"
  if (listingStatus === "pending_review") return "draft"
  return "active"
}

function deriveLocation(entry: MyBusinessEntry): string {
  const b = entry.business
  const parts: string[] = []
  if (b.area) parts.push(b.area)
  if (b.nearestLandmark) parts.push(`Near ${b.nearestLandmark}`)
  if (b.addressNote) parts.push(b.addressNote)
  if (b.municipality?.name) parts.push(b.municipality.name)
  if (b.district?.name) parts.push(b.district.name)
  return parts.join(", ") || b.province?.name || "Nepal"
}

function entryToManagedBusiness(entry: MyBusinessEntry): ManagedBusiness {
  const role = entry.membershipRole as ManagedBusiness["role"] | undefined
  return {
    id: entry.business.id,
    name: entry.business.name,
    location: deriveLocation(entry),
    status: deriveManagedStatus(entry),
    lifecycleStatus: deriveLifecycleStatus(entry),
    role: role === "owner" || role === "manager" ? role : undefined,
    claimStatus: entry.claimStatus === "pending" ? "pending-review" : undefined,
    profileCompleteness: computeProfileCompleteness(entry),
    reviewCount: entry.business.ratingCount,
  }
}

function computeProfileCompleteness(entry: MyBusinessEntry): number {
  const b = entry.business
  const checks = [
    Boolean(b.name),
    Boolean(b.description),
    Boolean(b.phone),
    Boolean(b.email),
    Boolean(b.logo),
    Boolean(b.banner),
    Boolean(b.photos && b.photos.length > 0),
    Boolean(b.establishmentType),
    Boolean(b.cuisines && b.cuisines.length > 0),
    Boolean(b.area || b.nearestLandmark || b.addressNote),
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}

function statusBadge(status: ManagedBusiness["status"]) {
  switch (status) {
    case "active":
      return <MithoBadge variant="success">Ready to manage</MithoBadge>
    case "setup-needed":
      return <MithoBadge variant="warning">Finish setup</MithoBadge>
    case "claim-pending":
      return <MithoBadge variant="muted">Claim pending</MithoBadge>
  }
}

function lifecycleBadge(status: ManagedBusiness["lifecycleStatus"]) {
  switch (status) {
    case "temporarily_closed":
      return <MithoBadge variant="warning">Temporarily closed</MithoBadge>
    case "permanently_closed":
      return <MithoBadge variant="muted">Permanently closed</MithoBadge>
    case "unclaimed":
      return <MithoBadge variant="neutral">Unclaimed listing</MithoBadge>
    default:
      return null
  }
}

function BusinessCard({ business, publicHref }: { business: ManagedBusiness; publicHref: string }) {
  const manageHref = `/dashboard/businesses/${business.id}/overview`

  return (
    <article className="rounded-[1.65rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_28px_rgba(10,70,53,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,70,53,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {statusBadge(business.status)}
            {lifecycleBadge(business.lifecycleStatus)}
            {business.role ? <MithoBadge variant="neutral">{business.role === "owner" ? "Owner access" : "Manager access"}</MithoBadge> : null}
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">{business.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{business.location}</p>
        </div>

        <div className="rounded-[1.1rem] bg-surface-business-inset px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Profile health</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{business.profileCompleteness ?? 0}% complete</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.15rem] bg-surface-business-inset px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Current status</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {business.status === "active"
              ? "This business is ready for day-to-day management."
              : business.status === "setup-needed"
                ? "A few profile basics still need attention before this listing feels complete."
                : "Your claim is still under review, so management access is limited for now."}
          </p>
        </div>

        <div className="rounded-[1.15rem] bg-surface-business-inset px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Useful next step</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {business.status === "active"
              ? `${business.reviewCount ?? 0} customer reviews are currently tied to this listing.`
              : business.status === "setup-needed"
                ? "Start with business info, hours, and photos so the listing is easier for customers to trust."
                : "We will unlock the full dashboard once the ownership review is approved."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {business.status === "claim-pending" ? (
          <MithoButton variant="outline-secondary" disabled>
            Pending verification
          </MithoButton>
        ) : (
          <MithoButton asChild>
            <Link href={manageHref}>
              {business.status === "setup-needed" ? "Finish setup" : "Manage"}
              <MoveRight className="h-4 w-4" />
            </Link>
          </MithoButton>
        )}

        <MithoButton variant="ghost" asChild>
          <Link href={publicHref}>View public listing</Link>
        </MithoButton>
      </div>
    </article>
  )
}

export function BusinessSwitcherPage() {
  const { data: entries, isLoading, isError } = useMyBusinesses()
  const { currentUser } = useAuthSnapshot()

  const managedBusinesses = (entries ?? []).map(entryToManagedBusiness)
  const hasBusinesses = managedBusinesses.length > 0

  return (
    <>
      <DashboardHeader
        businessName="Manage businesses"
        location="Choose a workspace or start a new listing"
        signedInUser={currentUser ?? undefined}
      />

      <main className="container mx-auto px-4 pb-12 pt-8">
        <section className="mb-8 rounded-[2rem] border border-brand-deep-green/10 bg-surface-business p-6 shadow-[0_12px_36px_rgba(10,70,53,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="type-eyebrow mb-3 text-brand-deep-green/70">Business workspace</p>
              <h1 className="type-page-title text-brand-dark-green">Choose the business you want to act on.</h1>
              <p className="type-body mt-3 text-muted-foreground">
                The same Mitho account can review places and manage one or more businesses. Business access happens through the listing you select here, not through a second login.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <MithoButton asChild>
                <Link href="/dashboard/businesses/new">
                  <CirclePlus className="h-4 w-4" />
                  Add business
                </Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/business/claim">
                  <FileCheck2 className="h-4 w-4" />
                  Claim a business
                </Link>
              </MithoButton>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-deep-green/40" />
          </div>
        ) : isError ? (
          <div className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-8 text-center shadow-[0_10px_24px_rgba(10,70,53,0.04)]">
            <p className="text-sm text-muted-foreground">Could not load your businesses. Please refresh to try again.</p>
          </div>
        ) : hasBusinesses ? (
          <>
            <section>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="type-eyebrow mb-3 text-brand-deep-green/70">Your businesses</p>
                  <h2 className="type-section-title text-foreground">Pick a workspace and keep moving.</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="capsule-cluster">{managedBusinesses.length} business{managedBusinesses.length === 1 ? "" : "es"}</span>
                  <span className="capsule-cluster">One account, multiple roles</span>
                </div>
              </div>

              <div className="grid gap-5">
                {(entries ?? []).map((entry) => (
                  <BusinessCard key={entry.business.id} business={entryToManagedBusiness(entry)} publicHref={getPublicBusinessHref(entry.business)} />
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.04)]">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                  <p className="type-eyebrow mb-3 text-brand-deep-green/70">How this works</p>
                  <h2 className="type-section-title text-foreground">One identity, multiple business contexts.</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Use this page whenever you need to switch from reviewing and browsing as a customer into managing a specific business presence. Each business can have its own setup status, claim state, and next steps.
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-surface-business-inset px-5 py-5">
                  <div className="flex items-center gap-3 text-brand-dark-green">
                    <ShieldCheck className="h-5 w-5 text-brand-orange" />
                    <p className="font-semibold">Helpful next moves</p>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>Use `Manage` when the listing is already live and editable.</li>
                    <li>Use `Finish setup` when the profile still needs basics like hours or photos.</li>
                    <li>Claims stay visible here so you do not lose track of pending approvals.</li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[2rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green">
                <Building2 className="h-8 w-8" />
              </div>
              <p className="type-eyebrow mt-6 text-brand-deep-green/70">No businesses yet</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
                Start by adding a new listing or claiming one that already exists.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                You do not need a second Mitho account to act as a business. Once a listing is added or claimed, it will show up here as a workspace you can manage.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.6rem] border border-brand-deep-green/10 bg-surface-business px-6 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green">
                  <CirclePlus className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">Add a new business</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Use this when the business is not on Mitho yet and you want to create the listing from scratch.
                </p>
                <MithoButton className="mt-6" asChild>
                  <Link href="/dashboard/businesses/new">
                    Start a new listing
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </MithoButton>
              </div>

              <div className="rounded-[1.6rem] border border-brand-deep-green/10 bg-surface-business px-6 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">Claim an existing business</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Use this when the listing already exists on Mitho and you want access to manage its profile and replies.
                </p>
                <MithoButton variant="outline-secondary" className="mt-6" asChild>
                  <Link href="/business/claim">
                    Open claim flow
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </MithoButton>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-surface-business-inset px-5 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Still reviewing places as a customer?</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    That is still the same account. This screen only adds business workspaces when you are ready to manage one.
                  </p>
                </div>
                <MithoButton variant="ghost" asChild>
                  <Link href="/explore">
                    Back to discovery
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </MithoButton>
              </div>
            </div>
          </section>
        )}
      </main>

      <DashboardFooter />
    </>
  )
}

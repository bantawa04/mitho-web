"use client"

import Link from "next/link"
import { Building2, CirclePlus, FileCheck2, LayoutDashboard, Loader2, Mail, MoveRight, ShieldCheck } from "lucide-react"
import type { MyBusinessEntry } from "@/types/business"
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useMyBusinesses } from "@/hooks/use-businesses"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useMyInvitations, useAcceptInvitation, useDeclineInvitation } from "@/hooks/use-business-invitations"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { ManagedBusiness } from "@/features/dashboard/data/dashboard-business-data"
import {
  computeBusinessProfileCompleteness,
  deriveBusinessLifecycleStatus,
  deriveManagedBusinessStatus,
  formatBusinessEntryLocation,
} from "@/features/dashboard/utils/dashboard-business-utils"
import { getPublicBusinessHref } from "@/lib/business-public-href"

function entryToManagedBusiness(entry: MyBusinessEntry): ManagedBusiness {
  const role = entry.membershipRole as ManagedBusiness["role"] | undefined
  return {
    id: entry.business.id,
    name: entry.business.name,
    location: formatBusinessEntryLocation(entry),
    status: deriveManagedBusinessStatus(entry),
    lifecycleStatus: deriveBusinessLifecycleStatus(entry),
    role: role === "owner" || role === "staff" ? role : undefined,
    claimStatus: entry.claimStatus === "pending" ? "pending-review" : undefined,
    profileCompleteness: computeBusinessProfileCompleteness(entry),
    reviewCount: entry.business.ratingCount,
  }
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

function BusinessCard({ business, publicHref }: { business: ManagedBusiness; publicHref: string | null }) {
  const manageHref = `/dashboard/businesses/${business.id}/overview`

  return (
    <article className="rounded-lg border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {statusBadge(business.status)}
            {lifecycleBadge(business.lifecycleStatus)}
            {business.role ? <MithoBadge variant="neutral">{business.role === "owner" ? "Owner access" : "Staff access"}</MithoBadge> : null}
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">{business.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{business.location}</p>
        </div>

        <div className="rounded-lg bg-surface-business-inset px-4 py-3 text-right">
          <p className="text-xs font-semibold text-muted-foreground">Profile health</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{business.profileCompleteness ?? 0}% complete</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-surface-business-inset px-4 py-4">
          <p className="text-xs font-semibold text-muted-foreground">Current status</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {business.status === "active"
              ? "This business is ready for day-to-day management."
              : business.status === "setup-needed"
                ? "A few profile basics still need attention before this listing feels complete."
                : "Your claim is still under review, so management access is limited for now."}
          </p>
        </div>

        <div className="rounded-lg bg-surface-business-inset px-4 py-4">
          <p className="text-xs font-semibold text-muted-foreground">Useful next step</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {business.status === "active"
              ? `${business.reviewCount ?? 0} customer reviews are currently tied to this listing.`
              : business.status === "setup-needed"
                ? "Start with business info, hours, and photos so the listing is easier for customers to trust."
                : "We will unlock the full dashboard once the ownership review is approved."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
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

        {publicHref ? (
          <MithoButton variant="ghost" asChild>
            <Link href={publicHref}>View public listing</Link>
          </MithoButton>
        ) : (
          <MithoButton variant="ghost" disabled>
            Public link unavailable
          </MithoButton>
        )}
      </div>
    </article>
  )
}

function PendingInvitationsCard() {
  const { data: invitations, isLoading } = useMyInvitations()
  const acceptMutation = useAcceptInvitation()
  const declineMutation = useDeclineInvitation()
  const { toast } = useToast()

  if (isLoading || !invitations?.length) return null

  async function handleAccept(id: string, businessName: string) {
    try {
      await acceptMutation.mutateAsync(id)
      toast({ title: "Invitation accepted", description: `You now have access to ${businessName}.` })
    } catch (error) {
      toast({ title: "Could not accept invitation", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  async function handleDecline(id: string) {
    try {
      await declineMutation.mutateAsync(id)
      toast({ title: "Invitation declined" })
    } catch (error) {
      toast({ title: "Could not decline invitation", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  return (
    <section className="mb-6 rounded-lg border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Pending invitations</p>
          <h2 className="text-lg font-semibold text-foreground">You have been invited to join a business workspace.</h2>
        </div>
      </div>

      <ul className="space-y-3">
        {invitations.map((inv) => (
          <li key={inv.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface-business-inset px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{inv.businessName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Role: {inv.role} · expires {new Date(inv.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <MithoButton
                size="sm"
                onClick={() => handleAccept(inv.id, inv.businessName)}
                disabled={acceptMutation.isPending || declineMutation.isPending}
              >
                Accept
              </MithoButton>
              <MithoButton
                variant="outline-secondary"
                size="sm"
                onClick={() => handleDecline(inv.id)}
                disabled={acceptMutation.isPending || declineMutation.isPending}
              >
                Decline
              </MithoButton>
            </div>
          </li>
        ))}
      </ul>
    </section>
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
        <PendingInvitationsCard />

        <section className="mb-6 rounded-lg border border-border bg-surface-business p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Business workspace</p>
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
          <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">Could not load your businesses. Please refresh to try again.</p>
          </div>
        ) : hasBusinesses ? (
          <>
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Your businesses</p>
                  <h2 className="type-section-title text-foreground">Pick a workspace and keep moving.</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="capsule-cluster">{managedBusinesses.length} business{managedBusinesses.length === 1 ? "" : "es"}</span>
                  <span className="capsule-cluster">One account, multiple roles</span>
                </div>
              </div>

              <div className="grid gap-4">
                {(entries ?? []).map((entry) => (
                  <BusinessCard key={entry.business.id} business={entryToManagedBusiness(entry)} publicHref={getPublicBusinessHref(entry.business)} />
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-lg border border-border bg-white p-4 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">How this works</p>
                  <h2 className="type-section-title text-foreground">One identity, multiple business contexts.</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Use this page whenever you need to switch from reviewing and browsing as a customer into managing a specific business presence. Each business can have its own setup status, claim state, and next steps.
                  </p>
                </div>

                <div className="rounded-lg bg-surface-business-inset px-5 py-5">
                  <div className="flex items-center gap-3 text-brand-dark-green">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
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
          <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Building2 className="h-8 w-8" />
              </div>
              <p className="mt-6 text-xs font-medium text-muted-foreground">No businesses yet</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
                Start by adding a new listing or claiming one that already exists.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                You do not need a second Mitho account to act as a business. Once a listing is added or claimed, it will show up here as a workspace you can manage.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
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

              <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
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

            <div className="mt-8 rounded-lg bg-surface-business-inset p-4">
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

"use client"

import Link from "next/link"
import { ChevronRight, Eye, Globe, Mail, MapPin, Pencil, Phone, ShieldCheck } from "lucide-react"
import type { AdminBusinessDetailItem, AdminBusinessLifecycleStatus, AdminBusinessStatus } from "@/features/admin/data/admin-data"
import { Button } from "@/components/ui/button"

function getStatusTone(status: AdminBusinessStatus) {
  switch (status) {
    case "Verified":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Claim request":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Pending":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Unclaimed":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function getLifecycleTone(status: AdminBusinessLifecycleStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Temporarily closed":
      return "bg-brand-soft-beige text-brand-orange border-brand-orange/10"
    case "Permanently closed":
    case "Unclaimed":
    case "Draft":
    case "Suspended":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.5rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{label}</p>
      <p className="mt-3 text-3xl font-semibold leading-none text-brand-dark-green">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  )
}

function DetailList({
  items,
}: {
  items: Array<{ label: string; value: string }>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{item.label}</p>
          <p className="text-sm text-brand-dark-green">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function AdminBusinessDetailPage({ business }: { business: AdminBusinessDetailItem }) {
  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/businesses" className="transition-colors hover:text-brand-dark-green">
            Businesses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">{business.name}</span>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(business.status)}`}>
                {business.status}
              </span>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getLifecycleTone(business.lifecycleStatus)}`}>
                {business.lifecycleStatus}
              </span>
              <span className="inline-flex rounded-full border border-brand-deep-green/10 bg-white px-3 py-1 text-xs font-semibold text-brand-dark-green">
                {business.establishmentType}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <img
                src={business.avatarUrl}
                alt={business.name}
                className="h-16 w-16 rounded-[1.2rem] border border-brand-deep-green/10 object-cover"
              />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">{business.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{business.location}</p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{business.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <Button asChild className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92">
              <Link href={`/admin/businesses/${business.slug}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit business
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40">
              <Link href={business.publicHref}>
                <Eye className="h-4 w-4" />
                Open public page
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Average rating" value={`${business.averageRating.toFixed(1)}/5`} helper="Current public rating across recent listing activity." />
        <MetricCard label="Reviews" value={String(business.reviewCount)} helper="Total reviews currently associated with this listing." />
        <MetricCard label="Profile views (30d)" value={String(business.profileViews30d)} helper="Recent directory attention for this business page." />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Listing details</h2>
                <p className="text-sm text-muted-foreground">Core public details the admin team is currently reviewing.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 border-t border-brand-deep-green/10 pt-6">
              <DetailList
                items={[
                  { label: "Primary category", value: business.primaryCategory },
                  { label: "Establishment type", value: business.establishmentType },
                  { label: "Neighborhood", value: business.neighborhood },
                  { label: "City", value: business.city },
                  { label: "Full address", value: business.fullAddress },
                  { label: "Created", value: business.createdAt },
                ]}
              />
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Contact & access</h2>
                <p className="text-sm text-muted-foreground">How this business currently appears as a reachable listing.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 border-t border-brand-deep-green/10 pt-6 text-sm text-brand-dark-green">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brand-orange" />
                <span>{business.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand-orange" />
                <span>{business.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 text-brand-orange" />
                <span className="break-all">{business.website}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Admin context</h2>
                <p className="text-sm text-muted-foreground">Internal ownership and claim information for this listing.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 border-t border-brand-deep-green/10 pt-6">
              <DetailList
                items={[
                  { label: "Owner", value: business.ownerName },
                  { label: "Owner email", value: business.ownerEmail },
                  { label: "Claimed", value: business.claimedAt },
                  { label: "Updated", value: business.updatedAt },
                ]}
              />
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Claim state</p>
                <p className="mt-2 text-sm leading-6 text-brand-dark-green">{business.claimStateNote}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ChevronRight,
  Eye,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Check,
  Image,
  UtensilsCrossed,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  AlertTriangle,
  CreditCard,
  Coffee,
  CalendarDays,
  User,
  ExternalLink,
} from "lucide-react"
import { getPublicBusinessHref } from "@/lib/business-public-href"
import { getMediaImage } from "@/lib/media-image"
import { DEFAULT_BUSINESS_LOGO } from "@/features/business/constants/business-media"
import { getPublicBusinessFeaturedImage } from "@/features/business/mappers/public-business-page-data"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { useBusiness } from "@/hooks/use-businesses"
import { ClaimReviewModal } from "@/features/admin/components/claim-review-modal"
import { useAdminEstablishmentTypes } from "@/hooks/use-admin-establishment-types"
import { formatAdminDate, formatAdminDateTime } from "@/features/admin/utils/admin-format-utils"
import { getBusinessListingPresentation, getBusinessOwnershipPresentation } from "@/features/admin/utils/admin-status-utils"
import { BrandLogo } from "@/components/mitho/brand-logo"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
      <p className="text-xs font-medium text-muted-foreground dark:text-brand-light-green/70">{label}</p>
      <p className="mt-3 text-3xl font-semibold leading-none text-brand-dark-green dark:text-brand-soft-beige">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  )
}

function DetailList({
  items,
}: {
  items: Array<{ label: string; value: string | React.ReactNode }>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground dark:text-brand-light-green/70">{item.label}</p>
          <div className="text-sm font-medium text-brand-dark-green dark:text-brand-soft-beige">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

function AmenitySection({
  title,
  icon,
  flags,
}: {
  title: string
  icon: React.ReactNode
  flags: Array<{ label: string; checked: boolean }>
}) {
  const activeFlags = flags.filter((f) => f.checked)
  if (activeFlags.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green dark:text-brand-soft-beige">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFlags.map((flag) => (
          <span
            key={flag.label}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-brand-dark-green dark:text-brand-soft-beige"
          >
            <Check className="h-3 w-3 text-brand-deep-green dark:text-brand-light-green" />
            {flag.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
          <Skeleton className="h-4 w-20" />
          <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Hero Banner Skeleton */}
        <Skeleton className="h-48 w-full rounded-lg sm:h-64" />

        {/* Title, status chips and buttons skeletons */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between mt-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-64 animate-pulse" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-12 w-full max-w-3xl" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col min-w-[200px]">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* Metric Cards Skeletons */}
      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </section>

      {/* Content Grid Skeletons */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="rounded-full bg-red-50 p-4 text-red-600 dark:bg-red-950/20 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Failed to load business details</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message || "An unexpected error occurred while retrieving the business listing."}</p>
      </div>
      <Button onClick={onRetry} className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92">
        Retry Loading
      </Button>
    </div>
  )
}

export function AdminBusinessDetailPage({ id }: { id: string }) {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const { data: business, isLoading, isError, error, refetch } = useBusiness(id)
  const { data: establishmentTypes } = useAdminEstablishmentTypes()

  const establishmentTypeMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of establishmentTypes ?? []) map.set(t.id, t.label)
    return map
  }, [establishmentTypes])

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (isError || !business) {
    return <ErrorState message={error?.message || "Business not found."} onRetry={refetch} />
  }

  const establishmentTypeLabel = business.establishmentTypeId
    ? (establishmentTypeMap.get(business.establishmentTypeId) ?? "Restaurant")
    : "Restaurant"
  const municipalityCategoryName = business.municipality.category?.name ?? ""
  const cityLabel = municipalityCategoryName
    ? `${business.municipality.name} (${municipalityCategoryName})`
    : business.municipality.name
  const addedByLabel = business.addedByUserName || business.addedByType
  const publicBusinessHref = getPublicBusinessHref(business)
  const featuredImage = getPublicBusinessFeaturedImage(business)
  const canOpenPublicPage = business.listingStatus === "published" && publicBusinessHref

  const fullAddress = [
    business.area,
    business.nearestLandmark ? `Near ${business.nearestLandmark}` : undefined,
    business.addressNote,
    business.wardNo ? `Ward ${business.wardNo}` : undefined,
    business.municipality.name,
    business.district.name,
    business.province.name,
  ]
    .filter(Boolean)
    .join(", ")

  const costText = business.avgCostPerPerson ? `Rs. ${business.avgCostPerPerson}` : "N/A"
  const costHelper = business.priceRange
    ? "Price level: " + "₨".repeat(business.priceRange)
    : "Average cost per person not specified."

  // Collect active social links
  const socialLinks = []
  if (business.links?.website) {
    socialLinks.push({ label: "Website", href: business.links.website, icon: <Globe className="h-4 w-4" /> })
  }
  if (business.links?.facebook) {
    socialLinks.push({ label: "Facebook", href: business.links.facebook, icon: <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" /> })
  }
  if (business.links?.instagram) {
    socialLinks.push({ label: "Instagram", href: business.links.instagram, icon: <Instagram className="h-4 w-4 text-pink-600 dark:text-pink-400" /> })
  }
  if (business.links?.twitter) {
    socialLinks.push({ label: "Twitter / X", href: business.links.twitter, icon: <Twitter className="h-4 w-4 text-sky-500 dark:text-sky-400" /> })
  }
  if (business.links?.youtube) {
    socialLinks.push({ label: "YouTube", href: business.links.youtube, icon: <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" /> })
  }
  if (business.links?.tiktok) {
    socialLinks.push({ label: "TikTok", href: business.links.tiktok, icon: <Globe className="h-4 w-4 text-stone-850 dark:text-stone-300" /> })
  }

  // Format dates
  const createdDate = formatAdminDateTime(business.createdAt)
  const updatedDate = formatAdminDateTime(business.updatedAt)

  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green dark:hover:text-brand-soft-beige">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/businesses" className="transition-colors hover:text-brand-dark-green dark:hover:text-brand-soft-beige">
            Businesses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green dark:text-brand-soft-beige">{business.name}</span>
        </div>

        {/* Premium Banner image header */}
        <div className="relative overflow-hidden rounded-lg border-slate-500/20 bg-brand-deep-green/10 h-48 sm:h-64 shadow-sm">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={`${business.name} featured image`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-deep-green/10">
              <div className="px-6 text-center">
                <BrandLogo kind="full" tone="green" className="mx-auto mb-6 w-48 opacity-30" />
                <p className="font-heading text-2xl font-bold tracking-tight text-brand-dark-green sm:text-3xl">
                  {business.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between mt-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <AdminStatusBadge
                {...getBusinessListingPresentation(business.listingStatus, { dark: true })}
                size="md"
                label={`Listing: ${getBusinessListingPresentation(business.listingStatus, { dark: true }).label}`}
              />
              <AdminStatusBadge
                {...getBusinessOwnershipPresentation(business.ownershipStatus, { dark: true })}
                size="md"
                label={`Ownership: ${getBusinessOwnershipPresentation(business.ownershipStatus, { dark: true }).label}`}
              />
              <span className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-brand-dark-green dark:bg-surface-admin dark:text-brand-soft-beige dark:border-brand-deep-green/15">
                {establishmentTypeLabel}
              </span>
              {business.isFeatured && (
                <span className="inline-flex rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning-foreground">
                  ★ Featured
                </span>
              )}
            </div>
            <div className="flex items-start gap-4">
              <img
                src={getMediaImage(business.logo, "logo", DEFAULT_BUSINESS_LOGO) ?? DEFAULT_BUSINESS_LOGO}
                alt={business.logo?.altText ?? `${business.name} logo`}
                className="h-16 w-16 rounded-lg border border-border bg-white object-contain p-1"
              />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green dark:text-brand-soft-beige">{business.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{business.municipality.name}, {business.district.name}</p>
                {business.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{business.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col min-w-[200px]">
            <Button asChild className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92">
              <Link href={`/admin/businesses/${business.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit business
              </Link>
            </Button>
            {business.ownershipStatus === "claim_under_review" && business.pendingClaim ? (
              <Button onClick={() => setSelectedClaimId(business.pendingClaim!.id)} variant="outline" className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
                <ShieldCheck className="h-4 w-4" />
                Review Request
              </Button>
            ) : null}
            {canOpenPublicPage ? (
              <Button asChild variant="outline" className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted dark:text-brand-soft-beige dark:border-brand-deep-green/20">
                <Link href={publicBusinessHref} target="_blank">
                  <Eye className="h-4 w-4" />
                  Open public page
                </Link>
              </Button>
            ) : business.listingStatus === "published" ? (
              <Button variant="outline" className="rounded-xl border-brand-deep-green/14 text-brand-dark-green dark:text-brand-soft-beige dark:border-brand-deep-green/20" disabled>
                <Eye className="h-4 w-4" />
                Public page unavailable
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Average rating" value={`${(business.ratingAvg ?? 0).toFixed(1)}/5`} helper="Current public rating across directory listing activity." />
        <MetricCard label="Reviews" value={String(business.ratingCount ?? 0)} helper="Total reviews currently associated with this listing." />
        <MetricCard label="Average Cost" value={costText} helper={costHelper} />
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {/* Left Column */}
        <div className="space-y-6">
          {business.ownershipStatus === "claim_under_review" && business.pendingClaim ? (
            <section className="rounded-xl border border-amber-100 bg-amber-50/70 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700/75">Ownership review</p>
                  <h2 className="mt-2 text-xl font-semibold text-amber-900">Claim request waiting for review</h2>
                  <p className="mt-2 text-sm leading-6 text-amber-800/80">
                    {business.pendingClaim.claimantName || "Claimant"} submitted this request on {formatAdminDate(business.pendingClaim.createdAt)}. Claim approval is handled from Business Claims, not from business publishing.
                  </p>
                </div>
                <Button onClick={() => setSelectedClaimId(business.pendingClaim!.id)} className="shrink-0 rounded-xl bg-amber-700 text-white hover:bg-amber-800">
                  <ShieldCheck className="h-4 w-4" />
                  Review Request
                </Button>
              </div>
            </section>
          ) : null}

          {/* Listing Details */}
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Listing details</h2>
                <p className="text-sm text-muted-foreground">Core details and location parameters of the business listing.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 border-t border-border pt-6">
              <DetailList
                items={[
                  { label: "Establishment type", value: establishmentTypeLabel },
                  { label: "City", value: cityLabel },
                  { label: "District", value: business.district.name },
                  { label: "Province", value: business.province.name },
                  { label: "Ward Number", value: business.wardNo ? `Ward ${business.wardNo}` : "No ward" },
                  { label: "Area", value: business.area || "N/A" },
                  { label: "Nearest landmark", value: business.nearestLandmark || "N/A" },
                  { label: "Address note", value: business.addressNote || "N/A" },
                  { label: "Full address", value: fullAddress },
                  {
                    label: "Map Coordinates",
                    value: (business.longitude && business.latitude) ?? (
                      <span>Latitude: {business.latitude ?? "Not provided"}, Longitude: {business.longitude ?? "Not provided"}</span>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          {/* Contact Details */}
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Contact & access</h2>
                <p className="text-sm text-muted-foreground">How this business is reachable through public directory entries.</p>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4 text-sm text-brand-dark-green dark:text-brand-soft-beige">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">{business.phone}</p>
                    {business.phoneSecondary && (
                      <p className="text-xs text-muted-foreground">Secondary: {business.phoneSecondary}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="break-all">{business.email || "No email listed"}</span>
                </div>
              </div>

              {/* Social and Web Links */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground dark:text-brand-light-green/70">Links</p>
                {socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-brand-dark-green hover:bg-muted dark:bg-surface-admin dark:text-brand-soft-beige dark:border-brand-deep-green/15"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No links specified.</p>
                )}
              </div>
            </div>
          </section>

          {/* Amenities & Offerings */}
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Amenities & offerings</h2>
                <p className="text-sm text-muted-foreground">Accommodations, payment options, and service features available.</p>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Services */}
                <AmenitySection
                  title="Services"
                  icon={<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />}
                  flags={[
                    { label: "Dine-In", checked: !!business.amenities?.services?.dine_in },
                    { label: "Takeaway", checked: !!business.amenities?.services?.takeaway },
                    { label: "Delivery", checked: !!business.amenities?.services?.delivery },
                  ]}
                />

                {/* Payments */}
                <AmenitySection
                  title="Payment methods"
                  icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                  flags={[
                    { label: "Cash", checked: !!business.amenities?.payment?.cash },
                    { label: "Card Payment", checked: !!business.amenities?.payment?.card },
                    { label: "eSewa", checked: !!business.amenities?.payment?.esewa },
                    { label: "Khalti", checked: !!business.amenities?.payment?.khalti },
                    { label: "QR Code Scan", checked: !!business.amenities?.payment?.qr },
                  ]}
                />

                {/* Facilities */}
                <AmenitySection
                  title="Facilities"
                  icon={<Coffee className="h-4 w-4 text-muted-foreground" />}
                  flags={[
                    { label: "Parking Available", checked: !!business.amenities?.facilities?.parking },
                    { label: "WiFi Access", checked: !!business.amenities?.facilities?.wifi },
                    { label: "Air Conditioning", checked: !!business.amenities?.facilities?.air_conditioning },
                    { label: "Outdoor Seating", checked: !!business.amenities?.facilities?.outdoor_seating },
                    { label: "Service Charge", checked: !!business.amenities?.facilities?.service_charge },
                  ]}
                />

                {/* Dietary */}
                <AmenitySection
                  title="Dietary restrictions"
                  icon={<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />}
                  flags={[
                    { label: "Vegetarian Options", checked: !!business.amenities?.dietary?.vegetarian },
                    { label: "Vegan Friendly", checked: !!business.amenities?.dietary?.vegan },
                    { label: "Halal Food", checked: !!business.amenities?.dietary?.halal },
                    { label: "Non Veg", checked: !!business.amenities?.dietary?.non_veg },
                  ]}
                />
              </div>

              {(!business.amenities ||
                (!business.amenities.services &&
                  !business.amenities.payment &&
                  !business.amenities.facilities &&
                  !business.amenities.dietary)) && (
                <p className="text-sm text-muted-foreground text-center py-4">No amenities or offerings defined.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Admin Context metadata */}
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Admin context</h2>
                <p className="text-sm text-muted-foreground">Internal context, identifiers, and audit lifecycle metadata.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 border-t border-border pt-6">
              <DetailList
                items={[
                  { label: "Business ID", value: <span className="font-mono text-xs select-all">{business.id}</span> },
                  { label: "Added by", value: addedByLabel },
                  { label: "Created at", value: <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> {createdDate}</span> },
                  { label: "Last modified", value: <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> {updatedDate}</span> },
                ]}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Photo Gallery Row */}
      {business.photos && business.photos.length > 0 && (
        <section className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-surface-admin dark:border-brand-deep-green/15">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Image className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-dark-green dark:text-brand-soft-beige">Photos gallery ({business.photos.length})</h2>
              <p className="text-sm text-muted-foreground">Uploaded storefront, interior, food, and directory assets.</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {business.photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/30 hover:border-brand-deep-green/30 transition-colors"
              >
                <img
                  src={getMediaImage(photo, "thumb", photo.publicUrl) ?? photo.publicUrl}
                  alt={photo.altText ?? "Gallery Photo"}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      <ClaimReviewModal 
        claimId={selectedClaimId} 
        onOpenChange={(open) => {
          if (!open) setSelectedClaimId(null)
        }} 
      />
    </div>
  )
}

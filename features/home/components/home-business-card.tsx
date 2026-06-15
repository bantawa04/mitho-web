import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Navigation } from "lucide-react"
import { StarRating } from "@/components/mitho/mitho-rating"
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_BUSINESS_FEATURED_IMAGE } from "@/features/business/constants/business-media"
import { getPublicBusinessHref } from "@/lib/business-public-href"
import { cn } from "@/lib/utils"
import type { BusinessSearchItem } from "@/types/business"

function formatBusinessLocation(business: BusinessSearchItem): string {
  const parts = [business.area, business.municipality?.name, business.district?.name].filter(
    (value): value is string => Boolean(value && value.trim()),
  )
  return parts.length > 0 ? parts.join(", ") : "Location not listed"
}

function formatBusinessCuisines(business: BusinessSearchItem): string | null {
  const names = (business.cuisines ?? [])
    .map((cuisine) => cuisine.name)
    .filter((name) => Boolean(name && name.trim()))

  if (names.length === 0) return null
  return names.slice(0, 3).join(" / ")
}

function formatDistance(distanceKm?: number | null): string | null {
  if (typeof distanceKm !== "number" || Number.isNaN(distanceKm) || distanceKm < 0) return null
  return `${distanceKm.toFixed(1)} km`
}

function CardShell({
  href,
  className,
  children,
}: {
  href: string | null
  className: string
  children: ReactNode
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return <article className={className}>{children}</article>
}

function BusinessCardImage({ business, sizes }: { business: BusinessSearchItem; sizes: string }) {
  const imageUrl = business.coverImage?.trim() || DEFAULT_BUSINESS_FEATURED_IMAGE

  return (
    <div className="relative aspect-[4/3]">
      <Image src={imageUrl} alt={business.name} fill sizes={sizes} className="object-cover" />
    </div>
  )
}

export function TrendingBusinessCard({ business }: { business: BusinessSearchItem }) {
  const href = getPublicBusinessHref(business)
  const cuisineLabel = formatBusinessCuisines(business) ?? business.establishmentType?.label?.trim() ?? "Local place"
  const ratingValue = typeof business.ratingAvg === "number" ? business.ratingAvg : null
  const hasRating = ratingValue !== null && business.ratingCount > 0

  return (
    <CardShell
      href={href}
      className="group block w-[316px] flex-shrink-0 overflow-hidden rounded-xl border border-brand-deep-green/10 bg-white shadow-sm transition-colors"
    >
      <BusinessCardImage business={business} sizes="316px" />

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-brand-dark-green">{business.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{cuisineLabel}</p>
          </div>
          <div className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/70">
            Latest
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {ratingValue !== null && business.ratingCount > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating rating={ratingValue} size="sm" />
              <span className="font-medium text-brand-dark-green">
                {ratingValue.toFixed(1)}{" "}
                <span className="text-muted-foreground">({business.ratingCount})</span>
              </span>
            </div>
          ) : (
            <span className="font-medium text-muted-foreground">No reviews yet</span>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{formatBusinessLocation(business)}</span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

export function NearbyBusinessCard({ business }: { business: BusinessSearchItem }) {
  const href = getPublicBusinessHref(business)
  const cuisineLabel = formatBusinessCuisines(business) ?? business.establishmentType?.label?.trim() ?? "Local place"
  const ratingValue = typeof business.ratingAvg === "number" ? business.ratingAvg : null
  const hasRating = ratingValue !== null && business.ratingCount > 0
  const distanceLabel = formatDistance(business.distanceKm) ?? "Within 5 km"

  return (
    <CardShell
      href={href}
      className="group block w-[276px] flex-shrink-0 overflow-hidden rounded-xl border border-brand-deep-green/10 bg-white shadow-sm transition-colors"
    >
      <div className="relative">
        <BusinessCardImage business={business} sizes="276px" />
        <div className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-brand-dark-green">
          {distanceLabel}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-brand-dark-green">{business.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{cuisineLabel}</p>
          </div>
          <div className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/70">
            Nearby
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{formatBusinessLocation(business)}</span>
          </div>

          {ratingValue !== null && business.ratingCount > 0 ? (
            <div className="flex shrink-0 items-center gap-1 text-brand-dark-green">
              <StarRating rating={ratingValue} size="sm" />
              <span className="font-medium">{ratingValue.toFixed(1)}</span>
            </div>
          ) : (
            <span className="shrink-0 text-xs text-muted-foreground">New</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Navigation className="h-4 w-4" />
          <span>{distanceLabel} away</span>
        </div>
      </div>
    </CardShell>
  )
}

export function HomeBusinessCardSkeleton({
  variant,
}: {
  variant: "trending" | "nearby"
}) {
  return (
    <div
      className={cn(
        "flex-shrink-0 overflow-hidden rounded-xl border border-brand-deep-green/10 bg-white shadow-sm",
        variant === "trending" ? "w-[316px]" : "w-[276px]",
      )}
    >
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className={cn("space-y-4", variant === "trending" ? "p-5" : "p-4")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  )
}

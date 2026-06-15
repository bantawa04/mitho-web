import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"
import { BusinessCardImagePlaceholder } from "@/components/mitho/business-image-placeholder"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { StarRating } from "@/components/mitho/mitho-rating"
import type { BusinessSearchItem } from "@/types/business"

interface BusinessSearchResultCardProps {
  business: BusinessSearchItem
}

function formatLocation(business: BusinessSearchItem): string {
  const parts = [
    business.area,
    business.municipality?.name,
    business.district?.name,
  ].filter((value): value is string => Boolean(value && value.trim()))
  return parts.length > 0 ? parts.join(", ") : "Location not listed"
}

function formatCuisines(business: BusinessSearchItem): string | null {
  const names = (business.cuisines ?? [])
    .map((cuisine) => cuisine.name)
    .filter((name) => Boolean(name && name.trim()))
  if (names.length === 0) return null
  return names.slice(0, 3).join(" • ")
}

export function BusinessSearchResultCard({ business }: BusinessSearchResultCardProps) {
  const imageUrl = business.coverImage?.trim() || null
  const href = business.publicPath
  const typeLabel = business.establishmentType?.label?.trim()
  const cuisineLabel = formatCuisines(business)
  const hasRating = typeof business.ratingAvg === "number" && business.ratingCount > 0
  const ratingValue = hasRating ? (business.ratingAvg as number) : 0

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={business.name}
              fill
              sizes="(min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          ) : (
            <BusinessCardImagePlaceholder className="w-full h-full" />
          )}
        </div>

        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {typeLabel && <MithoBadge variant="muted">{typeLabel}</MithoBadge>}
            {business.isFeatured && <MithoBadge variant="default">Featured</MithoBadge>}
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={href}
                className="text-2xl font-semibold leading-tight text-brand-dark-green transition-colors hover:text-primary"
              >
                {business.name}
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {formatLocation(business)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              {hasRating ? (
                <>
                  <div className="flex items-center gap-2">
                    <StarRating rating={ratingValue} size="sm" />
                    <span className="text-sm font-semibold tabular-nums text-brand-dark-green">
                      {ratingValue.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {business.ratingCount} {business.ratingCount === 1 ? "review" : "reviews"}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No reviews yet</span>
              )}
            </div>
          </div>

          {cuisineLabel && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-muted-foreground">Cuisines</p>
              <p className="mt-2 text-sm font-medium text-brand-dark-green">{cuisineLabel}</p>
            </div>
          )}

          <div className="mt-5">
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-primary"
            >
              Open full business page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

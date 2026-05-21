import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Navigation } from "lucide-react"
import { ClosedBadge, MithoBadge, OpenNowBadge } from "@/components/mitho/mitho-badge"
import { StarRating } from "@/components/mitho/mitho-rating"
import type { ExploreResult } from "@/features/discovery/explore/explore-types"

interface ExploreResultCardProps {
  result: ExploreResult
}

export function ExploreResultCard({ result }: ExploreResultCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(10,70,53,0.1)]">
      <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
          <Image
            src={result.imageUrl}
            alt={result.name}
            fill
            sizes="(min-width: 768px) 240px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {result.openNow ? <OpenNowBadge /> : <ClosedBadge />}
            <MithoBadge variant="muted">{result.cuisine}</MithoBadge>
            <MithoBadge variant="outline" className="border-brand-deep-green/18 text-brand-dark-green hover:bg-white">
              {result.priceRange}
            </MithoBadge>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={`/business/${result.slug}`}
                className="text-2xl font-semibold leading-tight text-brand-dark-green transition-colors hover:text-brand-orange"
              >
                {result.name}
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {result.location}
                </span>
                {typeof result.distanceKm === "number" && (
                  <span className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    {result.distanceKm.toFixed(1)} km away
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-2">
                <StarRating rating={result.rating} size="sm" />
                <span className="text-sm font-semibold text-brand-dark-green">{result.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{result.reviewCount} local reviews</span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep-green/58">What to order</p>
              <p className="mt-2 text-lg font-semibold text-brand-dark-green">{result.standoutDish}</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{result.whyGo}</p>
            </div>

            <div className="rounded-[1.35rem] bg-surface-soft px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep-green/58">Why locals trust it</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{result.trustNote}</p>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href={`/business/${result.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
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

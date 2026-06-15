"use client"
import { BadgeCheck, Bookmark, MapPin, PenLine, Share2 } from "lucide-react"
import { MithoBadge, OpenNowBadge, ClosedBadge } from "@/components/mitho/mitho-badge"
import { StarRating } from "@/components/mitho/mitho-rating"
import { MithoButton } from "@/components/mitho/mitho-button"
import { BrandLogo } from "@/components/mitho/brand-logo"
import type { BusinessHeroTag, BusinessSourceBadge } from "@/features/business/business-detail-types"

interface BusinessHeroProps {
  name: string
  sourceBadge?: BusinessSourceBadge
  isEarlyListing?: boolean
  coverImage?: string | null
  rating?: number | null
  reviewCount: number
  categories: BusinessHeroTag[]
  location: string
  isOpen: boolean | null
  heroNote: string
  onAddToCollection?: () => void
  onWriteReview?: () => void
  onShare?: () => void
}

export function BusinessHero({
  name,
  sourceBadge = "mitho",
  isEarlyListing = false,
  coverImage,
  rating,
  reviewCount,
  categories,
  location,
  isOpen,
  heroNote,
  onAddToCollection,
  onWriteReview,
  onShare,
}: BusinessHeroProps) {
  const hasReviews = reviewCount > 0 && rating !== null && rating !== undefined
  const sourceBadgeContent =
    sourceBadge === "verifiedOwner" ? (
      <MithoBadge variant="success" className="gap-1.5">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified owner
      </MithoBadge>
    ) : (
      <MithoBadge variant="muted">Added by Mitho</MithoBadge>
    )
  const statusBadge =
    isOpen === null ? (
      <MithoBadge variant="warning">Hours not listed</MithoBadge>
    ) : isOpen ? (
      <OpenNowBadge />
    ) : (
      <ClosedBadge />
    )

  return (
    <section className="relative">
      {coverImage ? (
        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[26rem]">
          <img src={coverImage} alt={name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-brand-deep-green/10 sm:h-80 lg:h-[26rem]">
          <div className="px-6 text-center">
            <BrandLogo kind="full" tone="green" className="mx-auto mb-6 w-48 opacity-30" />
            <p className="font-heading text-2xl font-bold tracking-tight text-brand-dark-green sm:text-3xl lg:text-4xl">{name}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_240px] md:items-start md:gap-6 lg:grid-cols-[minmax(0,1fr)_224px] lg:gap-8">
          <div className="max-w-3xl flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {statusBadge}
              {sourceBadgeContent}
            </div>

            <h1 className="type-page-title text-foreground">{name}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {heroNote}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {hasReviews ? (
                <div className="flex flex-wrap items-center gap-2 text-brand-dark-green">
                  <StarRating rating={rating} size="md" />
                  <span className="text-lg font-semibold tabular-nums">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">from {reviewCount} reviews</span>
                </div>
              ) : (
                <div className="text-sm font-medium text-brand-dark-green">
                  {isEarlyListing ? "Newly listed and waiting for its first local review" : "Be the first local to review this place"}
                </div>
              )}
            </div>

            {isEarlyListing && (
              <p className="mt-4 max-w-2xl rounded-lg border border-border bg-white px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                Mitho has added the basics so this place is easier to discover. Visit it, save it for later, or leave the first review to help the next person decide.
              </p>
            )}

            <div className="mt-5 space-y-2.5">
              {(() => {
                const establishments = categories.filter((c) => c.kind === "establishment")
                const cuisines = categories.filter((c) => c.kind !== "establishment")
                return (
                  <>
                    {establishments.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-deep-green/65 shrink-0">
                          Establishment Type
                        </span>
                        {establishments.map((category) => (
                          <span
                            key={`${category.kind}-${category.label}`}
                            className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground"
                          >
                            {category.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {cuisines.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-deep-green/65 shrink-0">
                          Cuisines Served
                        </span>
                        {cuisines.map((category) => (
                          <span
                            key={`${category.kind}-${category.label}`}
                            className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground"
                          >
                            {category.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 md:max-w-[240px] md:self-start lg:max-w-[224px]">
            <MithoButton
              size="lg"
              className="w-full justify-center"
              leftIcon={<PenLine className="h-5 w-5" />}
              onClick={onWriteReview}
            >
              Write a Review
            </MithoButton>
            <MithoButton
              variant="outline-secondary"
              size="lg"
              className="w-full justify-center"
              leftIcon={<Bookmark className="h-5 w-5" />}
              onClick={onAddToCollection}
            >
              Add to collection
            </MithoButton>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-dark-green"
            >
              <Share2 className="h-4 w-4" />
              Share this place
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

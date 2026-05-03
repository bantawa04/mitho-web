"use client"
import { ReviewSummary } from "@/components/ui/mitho-rating"
import type { BusinessRatingsData } from "@/components/business/business-detail-types"

interface RatingsSectionProps {
  isEarlyListing?: boolean
  ratingsData?: BusinessRatingsData | null
}

export function RatingsSection({ isEarlyListing = false, ratingsData }: RatingsSectionProps) {
  if (!ratingsData || ratingsData.totalReviews <= 0) {
    return isEarlyListing ? null : (
      <section className="container mx-auto px-4 pb-4 pt-12 md:pt-14">
        <div className="mb-6 max-w-2xl">
          <p className="type-eyebrow text-brand-deep-green/70">From locals</p>
          <h2 className="type-section-title mt-3 text-brand-dark-green">Ratings and reviews</h2>
          <p className="type-body mt-3 text-muted-foreground">
            See what people consistently say about the food, service, portions, and whether this place feels worth the trip.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 pb-4 pt-12 md:pt-14">
      <div className="mb-6 max-w-2xl">
        <p className="type-eyebrow text-brand-deep-green/70">From locals</p>
        <h2 className="type-section-title mt-3 text-brand-dark-green">Ratings and reviews</h2>
        <p className="type-body mt-3 text-muted-foreground">
          See what people consistently say about the food, service, portions, and whether this place feels worth the trip.
        </p>
      </div>

      <ReviewSummary {...ratingsData} />
    </section>
  )
}

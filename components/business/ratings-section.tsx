"use client"
import { ReviewSummary } from "@/components/ui/mitho-rating"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"
import type { BusinessRatingsData } from "@/components/business/business-detail-types"

interface RatingsSectionProps {
  ratingsData?: BusinessRatingsData | null
}

export function RatingsSection({ ratingsData }: RatingsSectionProps) {
  const hasReviews = Boolean(ratingsData && ratingsData.totalReviews > 0)

  return (
    <section className="container mx-auto px-4 pb-4 pt-12 md:pt-14">
      <div className="mb-6 max-w-2xl">
        <p className="type-eyebrow text-brand-deep-green/70">From locals</p>
        <h2 className="type-section-title mt-3 text-brand-dark-green">Ratings and reviews</h2>
        <p className="type-body mt-3 text-muted-foreground">
          See what people consistently say about the food, service, portions, and whether this place feels worth the trip.
        </p>
      </div>

      {hasReviews && ratingsData ? (
        <ReviewSummary {...ratingsData} />
      ) : (
        <MithoCard surface="inset" interactive="none">
          <MithoCardContent className="p-6">
            <p className="text-lg font-semibold text-brand-dark-green">No reviews yet</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This place is still waiting for its first local signal. If you visit, your experience can set the tone for everyone who checks here next.
            </p>
          </MithoCardContent>
        </MithoCard>
      )}
    </section>
  )
}

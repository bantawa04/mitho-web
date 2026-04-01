"use client"
import { ReviewSummary } from "@/components/ui/mitho-rating"
import {
  MithoSelect,
  MithoSelectTrigger,
  MithoSelectValue,
  MithoSelectContent,
  MithoSelectItem,
} from "@/components/ui/mitho-select"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"
import type { BusinessRatingsData } from "@/components/business/business-detail-types"

interface RatingsSectionProps {
  sortOrder?: string
  onSortChange?: (value: string) => void
  ratingsData?: BusinessRatingsData | null
}

export function RatingsSection({ sortOrder = "all", onSortChange, ratingsData }: RatingsSectionProps) {
  const hasReviews = Boolean(ratingsData && ratingsData.totalReviews > 0)

  return (
    <section className="container mx-auto px-4 pb-4 pt-12 md:pt-14">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-brand-deep-green/70">From locals</p>
          <h2 className="type-section-title mt-3 text-brand-dark-green">Ratings and reviews</h2>
          <p className="type-body mt-3 text-muted-foreground">
            See what people consistently say about the food, service, portions, and whether this place feels worth the trip.
          </p>
        </div>

        {hasReviews && (
          <MithoSelect value={sortOrder} onValueChange={onSortChange}>
            <MithoSelectTrigger className="w-full sm:w-[180px]">
              <MithoSelectValue placeholder="Sort reviews" />
            </MithoSelectTrigger>
            <MithoSelectContent>
              <MithoSelectItem value="all">All Reviews</MithoSelectItem>
              <MithoSelectItem value="latest">Latest First</MithoSelectItem>
              <MithoSelectItem value="oldest">Oldest First</MithoSelectItem>
            </MithoSelectContent>
          </MithoSelect>
        )}
      </div>

      {hasReviews ? (
        <ReviewSummary {...ratingsData} />
      ) : (
        <MithoCard surface="inset" interactive="none">
          <MithoCardContent className="p-6">
            <p className="text-lg font-semibold text-brand-dark-green">No reviews yet</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This business is still waiting for its first review. If you visit, your experience can become the first useful signal for everyone else.
            </p>
          </MithoCardContent>
        </MithoCard>
      )}
    </section>
  )
}

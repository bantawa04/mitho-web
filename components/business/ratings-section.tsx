"use client"
import { ReviewSummary } from "@/components/ui/mitho-rating"
import {
  MithoSelect,
  MithoSelectTrigger,
  MithoSelectValue,
  MithoSelectContent,
  MithoSelectItem,
} from "@/components/ui/mitho-select"

const ratingsData = {
  ratings: { 5: 156, 4: 89, 3: 32, 2: 12, 1: 5 },
  averageRating: 4.3,
  totalReviews: 294,
}

interface RatingsSectionProps {
  sortOrder?: string
  onSortChange?: (value: string) => void
}

export function RatingsSection({ sortOrder = "all", onSortChange }: RatingsSectionProps) {
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
      </div>

      <ReviewSummary {...ratingsData} />
    </section>
  )
}

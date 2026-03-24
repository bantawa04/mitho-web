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
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">Ratings & Reviews</h2>

        {/* Sort Dropdown */}
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

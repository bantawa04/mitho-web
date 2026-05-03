"use client"

import * as React from "react"
import { MithoReviewCard } from "@/components/ui/mitho-review-card"
import { MithoPagination } from "@/components/ui/mitho-pagination"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"
import {
  MithoSelect,
  MithoSelectContent,
  MithoSelectItem,
  MithoSelectTrigger,
  MithoSelectValue,
} from "@/components/ui/mitho-select"
import type { BusinessReview } from "@/components/business/business-detail-types"

const REVIEWS_PER_PAGE = 3

interface ReviewsSectionProps {
  isEarlyListing?: boolean
  sortOrder?: string
  onSortChange?: (value: string) => void
  reviews: BusinessReview[]
  emptyMessage?: string
}

export function ReviewsSection({
  isEarlyListing = false,
  sortOrder = "all",
  onSortChange,
  reviews,
  emptyMessage,
}: ReviewsSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const hasReviews = reviews.length > 0

  const sortedReviews = React.useMemo(() => {
    const nextReviews = [...reviews]
    if (sortOrder === "latest") {
      return nextReviews
    } else if (sortOrder === "oldest") {
      return nextReviews.reverse()
    }
    return nextReviews
  }, [reviews, sortOrder])

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE)

  const paginatedReviews = React.useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
    return sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)
  }, [sortedReviews, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [sortOrder])

  return (
    <section className="container mx-auto px-4 py-6">
      {hasReviews ? (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-dark-green">Recent local reviews</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Read the details behind the score, from standout dishes to whether the visit felt worth repeating.
              </p>
            </div>

            <MithoSelect value={sortOrder} onValueChange={onSortChange}>
              <MithoSelectTrigger className="w-full sm:w-[190px]">
                <MithoSelectValue placeholder="Sort reviews" />
              </MithoSelectTrigger>
              <MithoSelectContent>
                <MithoSelectItem value="all">All Reviews</MithoSelectItem>
                <MithoSelectItem value="latest">Latest First</MithoSelectItem>
                <MithoSelectItem value="oldest">Oldest First</MithoSelectItem>
              </MithoSelectContent>
            </MithoSelect>
          </div>

          <div className="space-y-5">
            {paginatedReviews.map((review, index) => (
              <MithoReviewCard
                key={`${review.author}-${index}`}
                {...review}
                className="shadow-[0_12px_28px_rgba(10,70,53,0.06)]"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      ) : (
        <div className="pb-2 pt-1">
          <MithoCard surface="customer" interactive="none">
            <MithoCardContent className="p-6">
              <p className="text-lg font-semibold text-brand-dark-green">No local voices here yet</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {emptyMessage ??
                  (isEarlyListing
                    ? "Mitho has added the basics, but no one has shared a firsthand experience yet. If you go, your review can become the first useful signal here."
                    : "There are no local stories here yet. Your visit can become the first helpful one.")}
              </p>
            </MithoCardContent>
          </MithoCard>
        </div>
      )}
    </section>
  )
}

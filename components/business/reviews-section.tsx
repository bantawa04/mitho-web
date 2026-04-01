"use client"

import * as React from "react"
import { MithoReviewCard } from "@/components/ui/mitho-review-card"
import { MithoPagination } from "@/components/ui/mitho-pagination"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"
import type { BusinessReview } from "@/components/business/business-detail-types"

const REVIEWS_PER_PAGE = 3

interface ReviewsSectionProps {
  sortOrder?: string
  reviews: BusinessReview[]
  emptyMessage?: string
}

export function ReviewsSection({ sortOrder = "all", reviews, emptyMessage }: ReviewsSectionProps) {
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
        <MithoCard surface="customer" interactive="none">
          <MithoCardContent className="p-6">
            <p className="text-lg font-semibold text-brand-dark-green">No local voices here yet</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {emptyMessage ?? "No reviews have been added yet."}
            </p>
          </MithoCardContent>
        </MithoCard>
      )}
    </section>
  )
}

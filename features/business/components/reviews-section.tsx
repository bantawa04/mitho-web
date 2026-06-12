"use client"

import { MithoReviewCard } from "@/components/mitho/mitho-review-card"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"
import {
  MithoSelect,
  MithoSelectContent,
  MithoSelectItem,
  MithoSelectTrigger,
  MithoSelectValue,
} from "@/components/mitho/mitho-select"
import type { BusinessReview } from "@/features/business/business-detail-types"

interface ReviewsSectionProps {
  isEarlyListing?: boolean
  sortOrder?: string
  onSortChange?: (value: string) => void
  reviews: BusinessReview[]
  emptyMessage?: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function ReviewsSection({
  isEarlyListing = false,
  sortOrder = "all",
  onSortChange,
  reviews,
  emptyMessage,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: ReviewsSectionProps) {
  const hasReviews = reviews.length > 0

  return (
    <section className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-xl border border-border bg-white/70" />
          ))}
        </div>
      ) : hasReviews ? (
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
                <MithoSelectItem value="latest">Latest First</MithoSelectItem>
                <MithoSelectItem value="oldest">Oldest First</MithoSelectItem>
                <MithoSelectItem value="highest">Highest Rating</MithoSelectItem>
                <MithoSelectItem value="lowest">Lowest Rating</MithoSelectItem>
              </MithoSelectContent>
            </MithoSelect>
          </div>

          <div className="rounded-xl border border-border bg-white px-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border py-5 last:border-0">
                <MithoReviewCard {...review} className="rounded-none border-0 bg-transparent p-0 shadow-none" />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
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

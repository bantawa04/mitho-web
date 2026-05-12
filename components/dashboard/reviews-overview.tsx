"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, MessageSquare, Send } from "lucide-react"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"
import { StarRating, ReviewProgress } from "@/components/ui/mitho-rating"

type ReviewItem = {
  id: string
  author: string
  rating: number
  date: string
  content: string
}

const REVIEWS: ReviewItem[] = [
  {
    id: "review-rajesh",
    author: "Rajesh K.",
    rating: 5,
    date: "2 days ago",
    content: "Amazing food and great service! Will definitely come back.",
  },
  {
    id: "review-priya",
    author: "Priya S.",
    rating: 4,
    date: "5 days ago",
    content: "Good experience overall. The momos were delicious.",
  },
  {
    id: "review-amit",
    author: "Amit T.",
    rating: 5,
    date: "1 week ago",
    content: "Best local spot in the area. Highly recommend!",
  },
  {
    id: "review-sandhya",
    author: "Sandhya R.",
    rating: 4,
    date: "1 week ago",
    content: "Dal bhat was dependable and the staff handled the lunch rush well.",
  },
  {
    id: "review-bikash",
    author: "Bikash M.",
    rating: 3,
    date: "2 weeks ago",
    content: "Good food, but the waiting time stretched longer than expected for a weekday dinner.",
  },
  {
    id: "review-laxmi",
    author: "Laxmi T.",
    rating: 5,
    date: "3 weeks ago",
    content: "The achar and sel roti pairing felt thoughtful. Worth another visit with friends.",
  },
]

const REVIEWS_PER_PAGE = 3

export function ReviewsOverview() {
  const ratings = { 5: 28, 4: 12, 3: 5, 2: 1, 1: 1 }
  const totalReviews = 47
  const averageRating = 4.6
  const [page, setPage] = useState(1)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")
  const [submittedReplyId, setSubmittedReplyId] = useState<string | null>(null)

  const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE)
  const visibleReviews = useMemo(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE
    return REVIEWS.slice(start, start + REVIEWS_PER_PAGE)
  }, [page])

  function openReply(reviewId: string) {
    setActiveReplyId(reviewId)
    setSubmittedReplyId(null)
    setReplyDraft("")
  }

  function closeReply() {
    setActiveReplyId(null)
    setReplyDraft("")
  }

  function submitReply(reviewId: string) {
    if (!replyDraft.trim()) return
    setSubmittedReplyId(reviewId)
    setActiveReplyId(null)
    setReplyDraft("")
  }

  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Feedback</p>
      <h2 className="type-section-title mb-6 text-foreground">Reviews overview</h2>
      <MithoCard surface="business" interactive="subtle" className="bg-white">
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Customer reviews</h3>
              <p className="type-meta">Manage and respond to customer feedback</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-col items-center justify-center gap-2 lg:min-w-[200px]">
              <span className="text-5xl font-bold text-brand-orange">{averageRating.toFixed(1)}</span>
              <StarRating rating={averageRating} size="lg" />
              <span className="text-sm text-muted-foreground">{totalReviews} reviews</span>
            </div>

            <div className="flex-1 space-y-2">
              <ReviewProgress stars={5} count={ratings[5]} total={totalReviews} />
              <ReviewProgress stars={4} count={ratings[4]} total={totalReviews} />
              <ReviewProgress stars={3} count={ratings[3]} total={totalReviews} />
              <ReviewProgress stars={2} count={ratings[2]} total={totalReviews} />
              <ReviewProgress stars={1} count={ratings[1]} total={totalReviews} />
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="type-meta font-semibold text-foreground">Latest reviews</h4>
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
            </div>

            <div className="space-y-4">
              {visibleReviews.map((review) => {
                const isReplyOpen = activeReplyId === review.id
                const isReplySubmitted = submittedReplyId === review.id

                return (
                  <div
                    key={review.id}
                    className="rounded-[1.1rem] border border-brand-deep-green/10 bg-white p-4 shadow-[0_6px_18px_rgba(10,70,53,0.04)]"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft-beige text-sm font-semibold text-brand-orange">
                        {review.author[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{review.author}</span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="ml-auto text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.content}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openReply(review.id)}
                            className="text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
                          >
                            Reply to review
                          </button>
                          {isReplySubmitted ? (
                            <span className="text-xs font-medium text-success">Reply queued in this mock flow.</span>
                          ) : null}
                        </div>

                        {isReplyOpen ? (
                          <div className="mt-4 rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset p-4">
                            <label htmlFor={`reply-${review.id}`} className="mb-2 block text-sm font-semibold text-foreground">
                              Draft your reply
                            </label>
                            <textarea
                              id={`reply-${review.id}`}
                              value={replyDraft}
                              onChange={(event) => setReplyDraft(event.target.value)}
                              placeholder="Write a calm, helpful response for this customer."
                              className="min-h-28 w-full rounded-[0.9rem] border border-brand-deep-green/12 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                            />
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <MithoButton
                                size="sm"
                                onClick={() => submitReply(review.id)}
                                rightIcon={<Send className="h-4 w-4" />}
                                disabled={!replyDraft.trim()}
                              >
                                Send reply
                              </MithoButton>
                              <MithoButton variant="ghost" size="sm" onClick={closeReply}>
                                Cancel
                              </MithoButton>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <MithoButton variant="outline-secondary" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </MithoButton>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1
                  const isActive = pageNumber === page

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep-green text-sm font-semibold text-white"
                          : "flex h-10 w-10 items-center justify-center rounded-full border border-brand-deep-green/12 bg-white text-sm font-semibold text-brand-dark-green transition-colors hover:border-brand-deep-green/22"
                      }
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <MithoButton
                variant="outline-secondary"
                size="sm"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </MithoButton>
            </div>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

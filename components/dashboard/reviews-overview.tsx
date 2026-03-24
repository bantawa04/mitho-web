"use client"

import { MessageSquare, ExternalLink } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent, MithoCardFooter } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"
import { StarRating, ReviewProgress } from "@/components/ui/mitho-rating"

export function ReviewsOverview() {
  const ratings = { 5: 28, 4: 12, 3: 5, 2: 1, 1: 1 }
  const totalReviews = 47
  const averageRating = 4.6

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Reviews Overview</h2>
      <MithoCard>
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Customer Reviews</h3>
              <p className="text-sm text-muted-foreground">Manage and respond to customer feedback</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center gap-2 lg:min-w-[200px]">
              <span className="text-5xl font-bold text-brand-orange">{averageRating.toFixed(1)}</span>
              <StarRating rating={averageRating} size="lg" />
              <span className="text-sm text-muted-foreground">{totalReviews} reviews</span>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              <ReviewProgress stars={5} count={ratings[5]} total={totalReviews} />
              <ReviewProgress stars={4} count={ratings[4]} total={totalReviews} />
              <ReviewProgress stars={3} count={ratings[3]} total={totalReviews} />
              <ReviewProgress stars={2} count={ratings[2]} total={totalReviews} />
              <ReviewProgress stars={1} count={ratings[1]} total={totalReviews} />
            </div>
          </div>

          {/* Latest Reviews Preview */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-4">Latest Reviews</h4>
            <div className="space-y-4">
              {[
                {
                  author: "Rajesh K.",
                  rating: 5,
                  date: "2 days ago",
                  content: "Amazing food and great service! Will definitely come back.",
                },
                {
                  author: "Priya S.",
                  rating: 4,
                  date: "5 days ago",
                  content: "Good experience overall. The momos were delicious.",
                },
                {
                  author: "Amit T.",
                  rating: 5,
                  date: "1 week ago",
                  content: "Best local spot in the area. Highly recommend!",
                },
              ].map((review, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 rounded-lg bg-brand-soft-beige/20 hover:bg-brand-soft-beige/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-semibold text-sm">
                    {review.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{review.author}</span>
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MithoCardContent>
        <MithoCardFooter>
          <MithoButton
            variant="primary"
            size="sm"
            rightIcon={<ExternalLink className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Respond to Reviews
          </MithoButton>
        </MithoCardFooter>
      </MithoCard>
    </section>
  )
}

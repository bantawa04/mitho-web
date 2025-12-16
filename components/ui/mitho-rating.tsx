"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const value = i + 1
          const filled = hoverRating ? value <= hoverRating : value <= rating
          const halfFilled = !filled && value - 0.5 <= rating

          return (
            <button
              key={i}
              type="button"
              className={cn(
                "transition-transform",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default",
              )}
              onClick={() => handleClick(value)}
              onMouseEnter={() => interactive && setHoverRating(value)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  filled
                    ? "fill-brand-orange text-brand-orange"
                    : halfFilled
                      ? "fill-brand-orange/50 text-brand-orange"
                      : "fill-transparent text-gray-300",
                )}
              />
            </button>
          )
        })}
      </div>
      {showValue && <span className="ml-1 text-sm font-medium text-foreground">{rating.toFixed(1)}</span>}
    </div>
  )
}

interface ReviewProgressProps {
  stars: number
  count: number
  total: number
}

// Color mapping: 5=green (excellent), 4=light-green, 3=yellow (average), 2=orange, 1=red (poor)
const getProgressColor = (stars: number): string => {
  switch (stars) {
    case 5:
      return "bg-brand-deep-green"
    case 4:
      return "bg-brand-green"
    case 3:
      return "bg-warning"
    case 2:
      return "bg-brand-orange"
    case 1:
      return "bg-danger"
    default:
      return "bg-brand-orange"
  }
}

export function ReviewProgress({ stars, count, total }: ReviewProgressProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  const label = stars === 1 ? "1 star" : `${stars} stars`

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-sm font-medium text-foreground">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getProgressColor(stars))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-10 text-sm text-muted-foreground text-right">{count}</span>
    </div>
  )
}

interface ReviewSummaryProps {
  ratings: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  averageRating: number
  totalReviews: number
}

export function ReviewSummary({ ratings, averageRating, totalReviews }: ReviewSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col items-center justify-center gap-2">
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
  )
}

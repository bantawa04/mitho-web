"use client"

import * as React from "react"
import { ThumbsUp, Flag, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "./mitho-rating"

interface ReviewMedia {
  type: "image" | "video"
  src: string
  thumbnail?: string
}

interface ReviewCardProps {
  author: string
  authorImage: string
  rating: number
  date: string
  content: string
  media?: ReviewMedia[]
  helpful?: number
  ownerResponse?: {
    content: string
    date: string
  }
  className?: string
}

export function MithoReviewCard({
  author,
  authorImage,
  rating,
  date,
  content,
  media,
  helpful = 0,
  ownerResponse,
  className,
}: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = React.useState(false)
  const [helpfulCount, setHelpfulCount] = React.useState(helpful)

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount((prev) => prev + 1)
      setIsHelpful(true)
    }
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={authorImage || "/placeholder.svg"}
          alt={author}
          className="w-12 h-12 rounded-full object-cover border-2 border-brand-soft-beige"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{author}</h4>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <StarRating rating={rating} size="sm" />
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-4">{content}</p>

      {/* Media */}
      {media && media.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {media.map((item, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={item.type === "video" ? item.thumbnail || item.src : item.src}
                alt={`Review media ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            isHelpful ? "text-brand-orange" : "text-muted-foreground hover:text-brand-orange",
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", isHelpful && "fill-brand-orange")} />
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-danger transition-colors"
        >
          <Flag className="h-4 w-4" />
          Report
        </button>
      </div>

      {/* Owner Response */}
      {ownerResponse && (
        <div className="mt-4 p-4 rounded-xl bg-brand-soft-beige/30 border-l-4 border-brand-deep-green">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-brand-deep-green">Response from Owner</span>
            <span className="text-xs text-muted-foreground">{ownerResponse.date}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{ownerResponse.content}</p>
        </div>
      )}
    </div>
  )
}

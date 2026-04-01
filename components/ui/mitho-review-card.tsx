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
    <div className={cn("rounded-[1.6rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)]", className)}>
      <div className="mb-4 flex items-start gap-3">
        <img
          src={authorImage || "/placeholder.svg"}
          alt={author}
          className="h-12 w-12 rounded-full border-2 border-brand-soft-beige object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-brand-dark-green">{author}</h4>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <StarRating rating={rating} size="sm" />
      </div>

      <p className="mb-4 leading-relaxed text-foreground">{content}</p>

      {media && media.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((item, index) => (
            <div
              key={index}
              className="group relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
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

      <div className="flex items-center gap-4 border-t border-brand-deep-green/10 pt-3">
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

      {ownerResponse && (
        <div className="mt-4 rounded-[1.2rem] border border-brand-deep-green/10 bg-brand-soft-beige/35 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-deep-green">Response from Owner</span>
            <span className="text-xs text-muted-foreground">{ownerResponse.date}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{ownerResponse.content}</p>
        </div>
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "./mitho-rating"

interface ReviewMedia {
  type: "image" | "video"
  src: string
  thumbnail?: string
}

interface ReviewCardProps {
  author: string
  authorUsername?: string | null
  authorImage: string
  rating: number
  date: string
  content: string
  media?: ReviewMedia[]
  ownerResponse?: {
    content: string
    date: string
  }
  className?: string
}

export function MithoReviewCard({
  author,
  authorUsername,
  authorImage,
  rating,
  date,
  content,
  media,
  ownerResponse,
  className,
}: ReviewCardProps) {
  const authorHref = authorUsername ? `/users/${authorUsername}` : null

  return (
    <div className={cn("rounded-xl border border-brand-deep-green/10 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]", className)}>
      <div className="mb-4 flex items-start gap-3">
        {authorHref ? (
          <Link href={authorHref} className="shrink-0">
            <img
              src={authorImage || "/placeholder.svg"}
              alt={author}
              className="h-12 w-12 rounded-full border-2 border-brand-soft-beige object-cover transition-opacity hover:opacity-80"
            />
          </Link>
        ) : (
          <img
            src={authorImage || "/placeholder.svg"}
            alt={author}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-brand-soft-beige object-cover"
          />
        )}
        <div className="flex-1">
          {authorHref ? (
            <Link href={authorHref} className="group inline-block">
              <h4 className="font-semibold text-brand-dark-green group-hover:underline">{author}</h4>
            </Link>
          ) : (
            <h4 className="font-semibold text-brand-dark-green">{author}</h4>
          )}
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
                className="w-full h-full object-cover"
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

      {ownerResponse && (
        <div className="mt-4 rounded-xl border border-brand-deep-green/10 bg-[#fffdf8] p-4">
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

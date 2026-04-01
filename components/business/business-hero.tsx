"use client"
import { Bookmark, MapPin, PenLine, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoBadge, OpenNowBadge, ClosedBadge } from "@/components/ui/mitho-badge"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

interface BusinessHeroProps {
  name: string
  coverImage: string
  rating: number
  reviewCount: number
  categories: string[]
  location: string
  isOpen: boolean
  isSaved?: boolean
  onSave?: () => void
  onWriteReview?: () => void
  onShare?: () => void
}

export function BusinessHero({
  name,
  coverImage,
  rating,
  reviewCount,
  categories,
  location,
  isOpen,
  isSaved = false,
  onSave,
  onWriteReview,
  onShare,
}: BusinessHeroProps) {
  return (
    <section className="relative">
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img src={coverImage || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="taste-spotlight relative -mt-20 rounded-[2rem] border border-brand-orange/12 p-5 shadow-[0_18px_48px_rgba(10,70,53,0.12)] sm:-mt-24 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
                <MithoBadge variant="neutral">{location}</MithoBadge>
                <MithoBadge variant="neutral">{reviewCount} local reviews</MithoBadge>
              </div>

              <h1 className="type-page-title text-foreground">{name}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                A reliable stop for comforting plates, generous portions, and the kind of food people in the
                neighborhood actually recommend to friends.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white/80 px-4 py-2 text-brand-dark-green">
                  <StarRating rating={rating} size="md" />
                  <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">from {reviewCount} reviews</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <MithoBadge key={category} variant="neutral">
                    {category}
                  </MithoBadge>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              <MithoButton size="lg" leftIcon={<PenLine className="h-5 w-5" />} onClick={onWriteReview}>
                Write a Review
              </MithoButton>
              <MithoButton
                variant={isSaved ? "secondary" : "outline-secondary"}
                size="lg"
                leftIcon={<Bookmark className={cn("h-5 w-5", isSaved && "fill-white")} />}
                onClick={onSave}
              >
                {isSaved ? "Saved" : "Save Place"}
              </MithoButton>
              <MithoButton variant="ghost" size="lg" leftIcon={<Share2 className="h-5 w-5" />} onClick={onShare}>
                Share
              </MithoButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

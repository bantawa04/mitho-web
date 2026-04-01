"use client"
import { Bookmark, Camera, MapPin, PenLine, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoBadge, OpenNowBadge, ClosedBadge } from "@/components/ui/mitho-badge"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

interface BusinessHeroProps {
  name: string
  coverImage?: string | null
  rating?: number | null
  reviewCount: number
  categories: string[]
  location: string
  isOpen: boolean
  heroNote: string
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
  heroNote,
  isSaved = false,
  onSave,
  onWriteReview,
  onShare,
}: BusinessHeroProps) {
  const hasReviews = reviewCount > 0 && rating !== null && rating !== undefined

  return (
    <section className="relative">
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {coverImage ? (
          <>
            <img src={coverImage} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff8ea_0%,#fffdf8_42%,#fff3d6_100%)]" />
            <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(239,138,0,0.12),transparent_40%,rgba(0,121,54,0.08))]" />
            <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-brand-orange/14 blur-3xl" />
            <div className="absolute right-4 top-8 h-64 w-64 rounded-full bg-brand-light-green/14 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-brand-deep-green/10 bg-white/75 px-5 py-3 text-sm font-semibold text-brand-dark-green backdrop-blur-sm">
                <span className="inline-flex items-center gap-2">
                  <Camera className="h-4 w-4 text-brand-orange" />
                  Photos coming soon
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="taste-spotlight relative -mt-20 rounded-[2rem] border border-brand-orange/12 p-5 shadow-[0_18px_48px_rgba(10,70,53,0.12)] sm:-mt-24 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
                <MithoBadge variant="neutral">{location}</MithoBadge>
                <MithoBadge variant="neutral">{hasReviews ? `${reviewCount} local reviews` : "No reviews yet"}</MithoBadge>
              </div>

              <h1 className="type-page-title text-foreground">{name}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {heroNote}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {hasReviews ? (
                  <div className="flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white/80 px-4 py-2 text-brand-dark-green">
                    <StarRating rating={rating} size="md" />
                    <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">from {reviewCount} reviews</span>
                  </div>
                ) : (
                  <div className="rounded-full border border-brand-deep-green/10 bg-white/80 px-4 py-2 text-sm font-medium text-brand-dark-green">
                    Be the first local to review this place
                  </div>
                )}
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

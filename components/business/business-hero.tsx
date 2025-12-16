"use client"
import { MapPin, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoBadge, OpenNowBadge, ClosedBadge } from "@/components/ui/mitho-badge"
import { StarRating } from "@/components/ui/mitho-rating"

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
}: BusinessHeroProps) {
  return (
    <section className="relative">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img src={coverImage || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          className={cn(
            "absolute top-4 right-4 p-3 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-lg",
            "transition-all duration-200",
            "hover:bg-white hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
            "active:scale-95",
          )}
          aria-label={isSaved ? "Remove from saved" : "Save business"}
        >
          <Heart
            className={cn(
              "h-6 w-6 transition-colors duration-200",
              isSaved ? "fill-brand-orange text-brand-orange" : "text-gray-600 hover:text-brand-orange",
            )}
          />
        </button>
      </div>

      {/* Business Info Overlay */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 sm:-mt-24 bg-card rounded-2xl shadow-xl p-5 sm:p-6 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={rating} size="md" />
                <span className="text-lg font-semibold text-foreground">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviewCount} reviews)</span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <MithoBadge key={category} variant="muted">
                    {category}
                  </MithoBadge>
                ))}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{location}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="sm:text-right">{isOpen ? <OpenNowBadge /> : <ClosedBadge />}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

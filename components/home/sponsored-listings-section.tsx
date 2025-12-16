"use client"

import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import {
  MithoCard,
  MithoCardHeader,
  MithoCardTitle,
  MithoCardDescription,
  MithoCardContent,
} from "@/components/ui/mitho-card"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { StarRating } from "@/components/ui/mitho-rating"
import { MapPin } from "lucide-react"

const sponsoredListings = [
  {
    name: "Everest Dine",
    cuisine: "Nepali • Multi-cuisine",
    rating: 4.5,
    reviewCount: 234,
    location: "Thamel, Kathmandu",
    imageUrl: "/placeholder.svg?height=200&width=300",
    offer: "20% off on first visit",
  },
  {
    name: "Himalayan Rooftop",
    cuisine: "Continental • Cafe",
    rating: 4.3,
    reviewCount: 189,
    location: "Basantapur, Kathmandu",
    imageUrl: "/placeholder.svg?height=200&width=300",
    offer: "Free dessert with meal",
  },
  {
    name: "Spice Garden",
    cuisine: "Indian • Nepali",
    rating: 4.6,
    reviewCount: 312,
    location: "Jhamsikhel, Lalitpur",
    imageUrl: "/placeholder.svg?height=200&width=300",
    offer: "Happy hour 4-6 PM",
  },
]

export function SponsoredListingsSection() {
  return (
    <MithoSection
      title="Featured Listings"
      subtitle="Handpicked recommendations from our partners"
      className="bg-brand-soft-beige/20"
    >
      <MithoCarousel>
        {sponsoredListings.map((listing, index) => (
          <MithoCard key={index} className="flex-shrink-0 w-[280px] sm:w-[320px] cursor-pointer group">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={listing.imageUrl || "/placeholder.svg"}
                alt={listing.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <MithoBadge variant="muted" size="sm" className="absolute top-3 left-3">
                Sponsored
              </MithoBadge>
              {listing.offer && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-brand-green text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg text-center truncate">
                    {listing.offer}
                  </div>
                </div>
              )}
            </div>
            <MithoCardHeader>
              <MithoCardTitle>{listing.name}</MithoCardTitle>
              <MithoCardDescription>{listing.cuisine}</MithoCardDescription>
            </MithoCardHeader>
            <MithoCardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <StarRating rating={listing.rating} size="sm" />
                <span className="text-sm font-medium">{listing.rating}</span>
                <span className="text-sm text-muted-foreground">({listing.reviewCount})</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </p>
            </MithoCardContent>
          </MithoCard>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

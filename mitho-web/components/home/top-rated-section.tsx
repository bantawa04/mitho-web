"use client"

import { Award } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import { RestaurantCard } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

const topRatedPlaces = [
  {
    name: "Krishna's Kitchen",
    cuisine: "Nepali • Vegetarian",
    rating: 4.9,
    reviewCount: 445,
    priceRange: "$$",
    location: "Durbar Marg, Kathmandu",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
    isTopRated: true,
  },
  {
    name: "The Yak & Yeti",
    cuisine: "Multi-cuisine • Fine Dining",
    rating: 4.8,
    reviewCount: 623,
    priceRange: "$$$",
    location: "Durbar Marg, Kathmandu",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
    isTopRated: true,
  },
  {
    name: "Trisara",
    cuisine: "Nepali • Contemporary",
    rating: 4.8,
    reviewCount: 312,
    priceRange: "$$$",
    location: "Lazimpat, Kathmandu",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
    isTopRated: true,
  },
  {
    name: "Jimbu Thakali",
    cuisine: "Thakali • Traditional",
    rating: 4.7,
    reviewCount: 289,
    priceRange: "$$",
    location: "Jhamsikhel, Lalitpur",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
    isTopRated: true,
  },
]

export function TopRatedSection() {
  return (
    <MithoSection
      title="Top Rated This Week"
      titleIcon={<Award className="h-6 w-6 text-brand-orange" />}
      subtitle="Highest rated by our community"
      action={<MithoButton variant="link">See All Top Rated</MithoButton>}
    >
      <MithoCarousel>
        {topRatedPlaces.map((place, index) => (
          <div key={index} className="flex-shrink-0 w-[300px]">
            <RestaurantCard {...place} />
          </div>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

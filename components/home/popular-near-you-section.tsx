"use client"

import { MapPin, Navigation } from "lucide-react"
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
import { MithoButton } from "@/components/ui/mitho-button"

const nearbyPlaces = [
  {
    name: "Bhojan Griha",
    type: "Restaurant",
    rating: 4.7,
    distance: "0.5 km",
    imageUrl: "/nepali-restaurant-traditional-interior.jpg",
  },
  {
    name: "Chiya Pasal",
    type: "Tea House",
    rating: 4.4,
    distance: "0.8 km",
    imageUrl: "/nepali-tea-house-chiya.jpg",
  },
  {
    name: "Sel Roti House",
    type: "Street Food",
    rating: 4.6,
    distance: "1.2 km",
    imageUrl: "/nepali-sel-roti-street-food.jpg",
  },
  {
    name: "Himalayan Java",
    type: "Cafe",
    rating: 4.5,
    distance: "1.5 km",
    imageUrl: "/himalayan-java-coffee-cafe-nepal.jpg",
  },
  {
    name: "Dal Bhat Power",
    type: "Restaurant",
    rating: 4.8,
    distance: "2.0 km",
    imageUrl: "/nepali-dal-bhat-traditional-meal.jpg",
  },
]

export function PopularNearYouSection() {
  return (
    <MithoSection
      title="Popular Near You"
      titleIcon={<MapPin className="h-6 w-6 text-brand-deep-green" />}
      subtitle="Based on your location"
      action={
        <MithoButton variant="secondary" size="sm" leftIcon={<Navigation className="h-4 w-4" />}>
          Update Location
        </MithoButton>
      }
    >
      <MithoCarousel>
        {nearbyPlaces.map((place, index) => (
          <MithoCard key={index} className="flex-shrink-0 w-[280px] cursor-pointer group">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={place.imageUrl || "/placeholder.svg"}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <MithoBadge variant="muted" className="absolute top-3 right-3">
                {place.distance}
              </MithoBadge>
            </div>
            <MithoCardHeader className="pb-2">
              <MithoCardTitle className="text-base">{place.name}</MithoCardTitle>
              <MithoCardDescription>{place.type}</MithoCardDescription>
            </MithoCardHeader>
            <MithoCardContent className="pt-0">
              <div className="flex items-center gap-2">
                <StarRating rating={place.rating} size="sm" />
                <span className="text-sm font-medium">{place.rating}</span>
              </div>
            </MithoCardContent>
          </MithoCard>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

"use client"

import * as React from "react"
import { RestaurantCard } from "@/components/ui/mitho-card"
import { MithoCarousel } from "@/components/ui/mitho-carousel"

const similarPlaces = [
  {
    name: "Thamel House",
    cuisine: "Nepali, Tibetan",
    rating: 4.5,
    reviewCount: 189,
    priceRange: "$$",
    location: "Thamel",
    distance: "0.3 km",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
  },
  {
    name: "Momo Queen",
    cuisine: "Nepali",
    rating: 4.7,
    reviewCount: 256,
    priceRange: "$",
    location: "Durbar Marg",
    distance: "0.5 km",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
    isTopRated: true,
  },
  {
    name: "Kathmandu Kitchen",
    cuisine: "Nepali, Indian",
    rating: 4.2,
    reviewCount: 134,
    priceRange: "$$",
    location: "Lazimpat",
    distance: "0.8 km",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: false,
  },
  {
    name: "Yak & Yeti Cafe",
    cuisine: "Tibetan, Continental",
    rating: 4.4,
    reviewCount: 198,
    priceRange: "$$$",
    location: "Durbar Marg",
    distance: "1.2 km",
    imageUrl: "/placeholder.svg?height=300&width=400",
    isOpen: true,
  },
]

export function SimilarPlaces() {
  const [savedItems, setSavedItems] = React.useState<Set<string>>(new Set())

  const toggleSave = (name: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(name)) {
        newSet.delete(name)
      } else {
        newSet.add(name)
      }
      return newSet
    })
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Similar Places Nearby</h2>
      <MithoCarousel>
        {similarPlaces.map((place) => (
          <div key={place.name} className="flex-shrink-0 w-[280px] sm:w-[320px]">
            <RestaurantCard {...place} isSaved={savedItems.has(place.name)} onSave={() => toggleSave(place.name)} />
          </div>
        ))}
      </MithoCarousel>
    </section>
  )
}

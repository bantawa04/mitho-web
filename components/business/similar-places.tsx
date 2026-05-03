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

interface SimilarPlacesProps {
  subdued?: boolean
}

export function SimilarPlaces({ subdued = false }: SimilarPlacesProps) {
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
    <section className={subdued ? "container mx-auto px-4 py-10" : "container mx-auto px-4 py-12"}>
      <div className="mb-5 max-w-2xl">
        <p className="type-eyebrow text-brand-deep-green/70">Keep exploring</p>
        <h2 className="type-section-title mt-3 text-brand-dark-green">Similar places nearby</h2>
        <p className="type-meta mt-3">
          {subdued
            ? "If this spot stays on your shortlist for later, these are a few nearby places people might also compare."
            : "If this one feels close but not quite right, these are the next places people usually compare."}
        </p>
      </div>
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

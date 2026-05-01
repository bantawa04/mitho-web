"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Navigation } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

const nearbyPlaces = [
  {
    name: "Bhojan Griha",
    type: "Restaurant",
    rating: 4.7,
    distance: "0.5 km",
    imageUrl: "/nepali-restaurant-traditional-interior.jpg",
    note: "A practical call when you want a full meal nearby and not another cafe stop.",
  },
  {
    name: "Chiya Pasal",
    type: "Tea House",
    rating: 4.4,
    distance: "0.8 km",
    imageUrl: "/nepali-tea-house-chiya.jpg",
    note: "Good for a slower tea break and small plates when the crowd matters less than the mood.",
  },
  {
    name: "Sel Roti House",
    type: "Street Food",
    rating: 4.6,
    distance: "1.2 km",
    imageUrl: "/nepali-sel-roti-street-food.jpg",
    note: "Worth the short detour if you want something local, filling, and easy on the budget.",
  },
  {
    name: "Himalayan Java",
    type: "Cafe",
    rating: 4.5,
    distance: "1.5 km",
    imageUrl: "/himalayan-java-coffee-cafe-nepal.jpg",
    note: "Reliable when you need a familiar coffee stop without spending too much time choosing.",
  },
]

export function PopularNearYouSection() {
  return (
    <MithoSection
      id="nearby"
      eyebrow="Nearby"
      title="Worth the short walk"
      titleIcon={<MapPin className="h-6 w-6 text-brand-deep-green" />}
      subtitle="Close-by picks for when the decision needs to be easy and the meal still needs to be good."
      density="compact"
      action={
        <MithoButton variant="outline-secondary" size="sm" asChild>
          <Link href="#">
            <Navigation className="h-4 w-4" />
            Update location
          </Link>
        </MithoButton>
      }
    >
      <MithoCarousel className="px-1 sm:px-3">
        {nearbyPlaces.map((place) => (
          <article
            key={place.name}
            className="w-[276px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border border-brand-deep-green/10 bg-white shadow-[0_8px_24px_rgba(10,70,53,0.05)]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                sizes="276px"
                className="object-cover"
              />
              <div className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-brand-dark-green">
                {place.distance}
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-brand-dark-green">{place.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{place.type}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-brand-dark-green">
                  <StarRating rating={place.rating} size="sm" />
                  <span>{place.rating}</span>
                </div>
              </div>

              <p className="text-sm leading-6 text-foreground">{place.note}</p>
            </div>
          </article>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

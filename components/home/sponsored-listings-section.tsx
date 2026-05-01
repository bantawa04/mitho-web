"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import { MithoButton } from "@/components/ui/mitho-button"
import { StarRating } from "@/components/ui/mitho-rating"

const sponsoredListings = [
  {
    name: "Everest Dine",
    cuisine: "Nepali • Multi-cuisine",
    rating: 4.5,
    reviewCount: 234,
    location: "Thamel, Kathmandu",
    imageUrl: "/restaurant-interior-cozy.jpg",
    offer: "20% off on first visit",
  },
  {
    name: "Himalayan Rooftop",
    cuisine: "Continental • Cafe",
    rating: 4.3,
    reviewCount: 189,
    location: "Basantapur, Kathmandu",
    imageUrl: "/himalayan-java-coffee-cafe-nepal.jpg",
    offer: "Free dessert with meal",
  },
  {
    name: "Spice Garden",
    cuisine: "Indian • Nepali",
    rating: 4.6,
    reviewCount: 312,
    location: "Jhamsikhel, Lalitpur",
    imageUrl: "/chef-cooking-nepali-food.jpg",
    offer: "Happy hour 4-6 PM",
  },
]

export function SponsoredListingsSection() {
  return (
    <MithoSection
      id="partners"
      eyebrow="Partner picks"
      title="A quieter space for clearly labeled placements"
      subtitle="Sponsored listings stay visible, but they should never feel louder than the editorial recommendations around them."
      density="compact"
      action={
        <MithoButton variant="link" asChild>
          <Link href="#for-business">Ask about featured placement</Link>
        </MithoButton>
      }
    >
      <MithoCarousel className="px-1 sm:px-3">
        {sponsoredListings.map((listing) => (
          <article
            key={listing.name}
            className="w-[292px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border border-brand-deep-green/10 bg-white shadow-[0_8px_22px_rgba(10,70,53,0.05)]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={listing.imageUrl}
                alt={listing.name}
                fill
                sizes="292px"
                className="object-cover"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-deep-green">
                Sponsored
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <p className="text-lg font-semibold text-brand-dark-green">{listing.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{listing.cuisine}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <StarRating rating={listing.rating} size="sm" />
                  <span className="font-medium text-brand-dark-green">
                    {listing.rating.toFixed(1)} <span className="text-muted-foreground">({listing.reviewCount})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </div>

              <p className="text-sm leading-6 text-foreground">{listing.offer}</p>
            </div>
          </article>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Flame, MapPin } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

const trendingPlaces = [
  {
    name: "Thakali Kitchen",
    cuisine: "Nepali • Traditional",
    rating: 4.8,
    reviewCount: 324,
    location: "Thamel, Kathmandu",
    imageUrl: "/nepali-restaurant-thakali-food.jpg",
    note: "Come for the achar and generous plates, especially when you need a dependable group dinner.",
  },
  {
    name: "Momo Central",
    cuisine: "Nepali • Dumplings",
    rating: 4.7,
    reviewCount: 512,
    location: "New Road, Kathmandu",
    imageUrl: "/nepali-momo-dumplings-restaurant.jpg",
    note: "Busy, fast-moving, and still one of the easiest late-evening momo calls in the city.",
  },
  {
    name: "Lakeside Cafe",
    cuisine: "Cafe • Continental",
    rating: 4.6,
    reviewCount: 189,
    location: "Lakeside, Pokhara",
    imageUrl: "/lakeside-cafe-pokhara-nepal.jpg",
    note: "Good for a slower coffee stop when you want a view without sacrificing the food.",
  },
  {
    name: "Newari Bhoj",
    cuisine: "Newari • Traditional",
    rating: 4.9,
    reviewCount: 278,
    location: "Bhaktapur",
    imageUrl: "/newari-traditional-food-nepal.jpg",
    note: "A strong pick when the goal is real smoke, spice, and a meal that feels rooted in place.",
  },
]

export function TrendingSection() {
  return (
    <MithoSection
      id="trending"
      eyebrow="Trending now"
      title="What locals are pulling up this week"
      titleIcon={<Flame className="h-7 w-7 text-brand-orange" />}
      subtitle="A tighter shortlist of places getting shared, saved, and talked about right now."
      density="feature"
      action={
        <MithoButton variant="link" asChild>
          <Link href="#">Browse all local picks</Link>
        </MithoButton>
      }
    >
      <MithoCarousel className="px-1 sm:px-3">
        {trendingPlaces.map((place) => (
          <article
            key={place.name}
            className="w-[316px] flex-shrink-0 overflow-hidden rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_30px_rgba(10,70,53,0.06)]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                sizes="316px"
                className="object-cover"
              />
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-brand-dark-green">{place.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{place.cuisine}</p>
                </div>
                <div className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/70">
                  Trending
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <StarRating rating={place.rating} size="sm" />
                  <span className="font-medium text-brand-dark-green">
                    {place.rating.toFixed(1)} <span className="text-muted-foreground">({place.reviewCount})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{place.location}</span>
                </div>
              </div>

              <p className="text-sm leading-6 text-foreground">{place.note}</p>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
              >
                Open this pick
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

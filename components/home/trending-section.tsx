"use client"

import { Flame } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCarousel } from "@/components/ui/mitho-carousel"
import { RestaurantCard } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

const trendingPlaces = [
  {
    name: "Thakali Kitchen",
    cuisine: "Nepali • Traditional",
    rating: 4.8,
    reviewCount: 324,
    priceRange: "$$",
    location: "Thamel, Kathmandu",
    imageUrl: "/nepali-restaurant-thakali-food.jpg",
    isOpen: true,
    isTrending: true,
  },
  {
    name: "Momo Central",
    cuisine: "Nepali • Dumplings",
    rating: 4.7,
    reviewCount: 512,
    priceRange: "$",
    location: "New Road, Kathmandu",
    imageUrl: "/nepali-momo-dumplings-restaurant.jpg",
    isOpen: true,
    isTrending: true,
  },
  {
    name: "Lakeside Cafe",
    cuisine: "Cafe • Continental",
    rating: 4.6,
    reviewCount: 189,
    priceRange: "$$",
    location: "Lakeside, Pokhara",
    imageUrl: "/lakeside-cafe-pokhara-nepal.jpg",
    isOpen: true,
    isTopRated: true,
  },
  {
    name: "Newari Bhoj",
    cuisine: "Newari • Traditional",
    rating: 4.9,
    reviewCount: 278,
    priceRange: "$$",
    location: "Bhaktapur",
    imageUrl: "/newari-traditional-food-nepal.jpg",
    isOpen: false,
    isTrending: true,
  },
  {
    name: "Sekuwa Corner",
    cuisine: "Nepali • BBQ",
    rating: 4.5,
    reviewCount: 156,
    priceRange: "$",
    location: "Patan, Lalitpur",
    imageUrl: "/nepali-sekuwa-bbq-grilled-meat.jpg",
    isOpen: true,
  },
]

export function TrendingSection() {
  return (
    <MithoSection
      title="Trending Local Gems"
      titleIcon={<Flame className="h-7 w-7 text-brand-orange" />}
      subtitle="Discover what's popular right now"
      action={<MithoButton variant="link">View All</MithoButton>}
    >
      <MithoCarousel>
        {trendingPlaces.map((place, index) => (
          <div key={index} className="flex-shrink-0 w-[300px]">
            <RestaurantCard {...place} />
          </div>
        ))}
      </MithoCarousel>
    </MithoSection>
  )
}

export interface ExploreResult {
  id: string
  slug: string
  name: string
  imageUrl: string
  cuisine: string
  category: string
  rating: number
  reviewCount: number
  location: string
  city: string
  openNow: boolean
  priceRange: "$" | "$$" | "$$$"
  distanceKm?: number
  standoutDish: string
  trustNote: string
  whyGo: string
}

export interface ExploreFilters {
  q: string
  city: string
  category: string
  sort: string
  openNow: boolean
  price: string
}

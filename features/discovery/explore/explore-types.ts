import type { BusinessSearchSort } from "@/types/business"

export interface ExploreResult {
  id: string
  slug: string
  publicHref: string
  name: string
  imageUrl: string
  cuisine: string
  category: string
  rating: number
  reviewCount: number
  location: string
  neighborhood?: string
  city: string
  openNow: boolean
  priceRange: "$" | "$$" | "$$$"
  distanceKm?: number
  standoutDish: string
  trustNote: string
  whyGo: string
  featured?: boolean
  editorialTakeaway?: string
  cityEditorialTakeaway?: string
  bestFor?: string
}

export interface ExploreFilters {
  q: string
  city: string
  category: string
  sort: string
  openNow: boolean
}

/**
 * Canonical, normalized state for the live (database-backed) explore page.
 * This is the single source of truth that is serialized to / parsed from the URL.
 */
export interface LiveExploreState {
  q: string
  /** establishment type id, or "" for all */
  type: string
  /** cuisine id, or "" for all */
  cuisine: string
  /** province id, or null for all Nepal */
  province: number | null
  /** district id, or null */
  district: number | null
  /** municipality id, or null */
  municipality: number | null
  sort: BusinessSearchSort
  page: number
}

export interface LiveExploreSortOption {
  value: BusinessSearchSort
  label: string
}

/** A generic id/label option used by the live single-select filters. */
export interface LiveExploreSelectOption {
  value: string
  label: string
}

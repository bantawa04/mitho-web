export interface BusinessBreadcrumbItem {
  label: string
  href?: string
}

export interface BusinessGalleryItem {
  type: "image" | "video"
  src: string
  alt: string
  thumbnail?: string
}

export interface BusinessMenuItem {
  name: string
  price: string
  imageUrl: string
  note: string
  isPopular?: boolean
}

export interface BusinessReview {
  id: string
  author: string
  authorUsername?: string | null
  authorImage: string
  title?: string
  rating: number
  date: string
  content: string
  tips?: string | null
  media?: Array<{
    type: "image" | "video"
    src: string
    thumbnail?: string
  }>
  helpful?: number
  ownerResponse?: {
    content: string
    date: string
  }
}

export interface BusinessRatingsData {
  ratings: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  averageRating: number
  totalReviews: number
}

export type BusinessSourceBadge = "mitho" | "verifiedOwner"
export type BusinessHeroTagKind = "establishment" | "cuisine"

export interface BusinessHeroTag {
  label: string
  kind: BusinessHeroTagKind
}

export type BusinessSocialPlatform = "facebook" | "instagram" | "twitter" | "youtube" | "tiktok"

export interface BusinessSocialLink {
  platform: BusinessSocialPlatform
  url: string
}

export type BusinessAmenityKey =
  | "wifi"
  | "parking"
  | "airConditioning"
  | "outdoorSeating"
  | "dineIn"
  | "takeaway"
  | "delivery"
  | "cards"
  | "cash"
  | "esewa"
  | "khalti"
  | "qr"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "nonVeg"
  | "accessible"
  | "alcohol"
  | "liveMusic"
  | "petFriendly"

/** A single labeled line for the structured address block. */
export interface BusinessAddressDetail {
  label: string
  value: string
}

export interface BusinessVisitInfo {
  address: string
  addressDetails?: BusinessAddressDetail[]
  phone?: string
  website?: string
  email?: string
  socialLinks?: BusinessSocialLink[]
  coordinates?: {
    lat: number
    lng: number
  }
  mapZoom?: number
  hours: Array<{
    day: string
    time: string
    dayOfWeek: number
  }>
  hoursStatus?: { label: string; tone: "open" | "closed" } | null
  todayDayOfWeek?: number
  establishmentType?: string
  priceRange?: number
  avgCostPerPerson?: number
  signatureItems?: string[]
  mealTypes?: string[]
  cuisines: string[]
  amenities: BusinessAmenityKey[]
  menuUrl?: string
  mapDescription?: string
  mapLinkText?: string
  goodToKnow?: string
}

export interface BusinessPageData {
  id: string
  name: string
  sourceBadge?: BusinessSourceBadge
  coverImage?: string | null
  rating?: number | null
  reviewCount: number
  categories: BusinessHeroTag[]
  location: string
  isOpen: boolean | null
  heroNote: string
  breadcrumbItems: BusinessBreadcrumbItem[]
  visitInfo: BusinessVisitInfo
  galleryItems: BusinessGalleryItem[]
  galleryTotalCount?: number
  galleryEmptyMessage?: string
  menuItems: BusinessMenuItem[]
  menuEmptyMessage?: string
  menuLink?: string
  ratingsData?: BusinessRatingsData | null
  reviews: BusinessReview[]
  reviewsEmptyMessage?: string
  addReviewPrompt?: string
}

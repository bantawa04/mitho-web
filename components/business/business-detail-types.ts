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
  author: string
  authorImage: string
  rating: number
  date: string
  content: string
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

export interface BusinessVisitInfo {
  address: string
  phone?: string
  website?: string
  email?: string
  hours: Array<{
    day: string
    time: string
  }>
  cuisines: string[]
  amenities: Array<"wifi" | "parking" | "takeaway" | "cards" | "accessible" | "dineIn" | "alcohol" | "liveMusic" | "petFriendly" | "vegan">
  mapImage: string
  mapDescription: string
  mapLinkText?: string
  goodToKnow: string
}

export interface BusinessPageData {
  name: string
  coverImage?: string | null
  rating?: number | null
  reviewCount: number
  categories: string[]
  location: string
  isOpen: boolean
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

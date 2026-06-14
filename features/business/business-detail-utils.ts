import type { BusinessPageData } from "@/features/business/business-detail-types"
import { DEFAULT_BUSINESS_FEATURED_IMAGE } from "@/features/business/constants/business-media"

type EarlyListingFields = Pick<
  BusinessPageData,
  "sourceBadge" | "coverImage" | "ratingsData" | "reviews" | "galleryItems" | "menuItems"
>

export function isBusinessEarlyListing(pageData: EarlyListingFields) {
  return (
    pageData.sourceBadge === "mitho" &&
    (!pageData.coverImage || pageData.coverImage === DEFAULT_BUSINESS_FEATURED_IMAGE) &&
    !pageData.ratingsData &&
    pageData.reviews.length === 0 &&
    pageData.galleryItems.length === 0 &&
    pageData.menuItems.length === 0
  )
}

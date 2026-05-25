import type { BusinessPageData } from "@/features/business/business-detail-types"

type EarlyListingFields = Pick<
  BusinessPageData,
  "sourceBadge" | "coverImage" | "ratingsData" | "reviews" | "galleryItems" | "menuItems"
>

export function isBusinessEarlyListing(pageData: EarlyListingFields) {
  return (
    pageData.sourceBadge === "mitho" &&
    !pageData.coverImage &&
    !pageData.ratingsData &&
    pageData.reviews.length === 0 &&
    pageData.galleryItems.length === 0 &&
    pageData.menuItems.length === 0
  )
}

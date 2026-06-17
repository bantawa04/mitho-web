import type {
  BusinessGalleryItem,
  BusinessRatingsData,
  BusinessReview,
  BusinessPageData,
  BusinessHeroTag,
  BusinessSocialLink,
  BusinessSocialPlatform,
  BusinessVisitInfo,
} from "@/features/business/business-detail-types"
import type {
  BusinessAmenities,
  BusinessHour,
  BusinessLinks,
  PublicBusiness,
} from "@/types/business"
import type { Media } from "@/types/media"
import type { ReviewItem, ReviewRatingsSummary } from "@/types/reviews"
import { getPublicBusinessHref } from "@/lib/business-public-href"
import {
  DAY_NAMES,
  computeBusinessHoursStatus,
  formatBusinessTime,
  getNepalNow,
} from "@/features/business/utils/business-hours"

export function getPublicBusinessFeaturedImage(
  business: Pick<PublicBusiness, "banner" | "photos">,
): string | null {
  return (
    business.banner?.publicUrl ||
    business.photos?.find(
      (photo) => photo.mediaType === "image" && photo.publicUrl,
    )?.publicUrl ||
    null
  )
}

export function mapPublicBusinessToPageData(
  business: PublicBusiness,
): BusinessPageData {
  const galleryItems = buildGalleryItems(business)
  const cuisineNames =
    business.cuisines?.map((cuisine) => cuisine.name).filter(Boolean) ?? []
  const establishmentLabel =
    business.establishmentType?.label ??
    business.municipality?.category?.name ??
    "Place"
  const location = [business.municipality?.name, business.district?.name]
    .filter(Boolean)
    .join(", ")
  const rating = business.ratingAvg ?? null
  const reviewCount = business.ratingCount ?? 0
  const categories: BusinessHeroTag[] = [
    { label: establishmentLabel, kind: "establishment" as const },
    ...cuisineNames.map((name) => ({ label: name, kind: "cuisine" as const })),
  ].filter(
    (category, index, all) =>
      all.findIndex((item) => item.label === category.label) === index,
  )

  const coverImage =
    business.banner?.publicUrl ||
    business.photos?.find(
      (photo) => photo.mediaType === "image" && photo.publicUrl,
    )?.publicUrl ||
    null

  return {
    id: business.id,
    name: business.name,
    sourceBadge:
      business.ownershipStatus === "claimed" ? "verifiedOwner" : "mitho",
    coverImage,
    rating,
    reviewCount,
    categories,
    location: location || business.province?.name || "Location not provided",
    isOpen: computeBusinessHoursStatus(business.hours).isOpen,
    heroNote:
      business.description ??
      business.specialityNote ??
      "A Mitho Cha listing with the essentials ready for people looking for a good local place to eat.",
    breadcrumbItems: [
      { label: "Home", href: "/" },
      {
        label: business.province?.name ?? "Province",
        href: `/${business.province?.slug ?? ""}`,
      },
      {
        label: business.district?.name ?? "District",
        href: `/${business.province?.slug ?? ""}/${business.district?.slug ?? ""}`,
      },
      {
        label: business.municipality?.name ?? "City",
        href: `/${business.province?.slug ?? ""}/${business.district?.slug ?? ""}/${business.municipality?.slug ?? ""}`,
      },
      { label: business.name },
    ],
    visitInfo: buildVisitInfo(business, cuisineNames),
    galleryItems,
    galleryTotalCount: galleryItems.length,
    galleryEmptyMessage:
      galleryItems.length === 0
        ? "No one has added photos yet. The first visit photos can help people quickly understand what this place feels like."
        : undefined,
    menuItems: [],
    menuLink: undefined,
    ratingsData: null,
    reviews: [],
    addReviewPrompt:
      "Share the details that actually help the next person decide.",
  }
}

export function mapReviewSummaryToRatingsData(
  summary: ReviewRatingsSummary | null | undefined,
): BusinessRatingsData | null {
  if (!summary || summary.totalReviews <= 0) return null
  return {
    ratings: {
      5: summary.ratings[5],
      4: summary.ratings[4],
      3: summary.ratings[3],
      2: summary.ratings[2],
      1: summary.ratings[1],
    },
    averageRating: summary.averageRating,
    totalReviews: summary.totalReviews,
  }
}

export function mapReviewItemToBusinessReview(
  item: ReviewItem,
): BusinessReview {
  return {
    id: item.id,
    author: item.author.name,
    authorUsername: item.author.username,
    authorImage: item.author.avatarUrl || "/placeholder.svg",
    title: item.title,
    rating: item.rating,
    date: formatReviewDate(item.createdAt),
    content: item.body,
    tips: item.tips,
    media: item.media
      .filter(
        (mediaItem) =>
          mediaItem.mediaType === "image" || mediaItem.mediaType === "video",
      )
      .map((mediaItem) => ({
        type:
          mediaItem.mediaType === "video"
            ? ("video" as const)
            : ("image" as const),
        src: mediaItem.publicUrl,
        thumbnail:
          mediaItem.mediaType === "video" ? mediaItem.publicUrl : undefined,
      })),
    ownerResponse: item.reply
      ? {
          content: item.reply.body,
          date: formatReviewDate(item.reply.updatedAt),
        }
      : undefined,
  }
}

export function buildPublicBusinessHref(
  business: Pick<
    PublicBusiness,
    "id" | "slug" | "province" | "district" | "municipality" | "publicPath"
  >,
) {
  return getPublicBusinessHref(business)
}

function buildVisitInfo(
  business: PublicBusiness,
  cuisineNames: string[],
): BusinessVisitInfo {
  const website = business.links?.website

  return {
    address: buildAddress(business),
    phone: business.phone || undefined,
    website,
    socialLinks: buildSocialLinks(business.links),
    coordinates:
      business.latitude !== undefined && business.longitude !== undefined
        ? { lat: business.latitude, lng: business.longitude }
        : undefined,
    mapZoom: 15,
    hours: formatHours(business.hours),
    hoursStatus: (() => {
      const status = computeBusinessHoursStatus(business.hours)
      return status.label ? { label: status.label, tone: status.tone } : null
    })(),
    todayDayOfWeek: getNepalNow().dayOfWeek,
    cuisines: cuisineNames,
    amenities: mapAmenities(business.amenities),
    mapLinkText: "Get directions",
  }
}

function buildGalleryItems(business: PublicBusiness): BusinessGalleryItem[] {
  const media = [business.banner, ...(business.photos ?? [])].filter(
    Boolean,
  ) as Media[]
  const seen = new Set<string>()

  return media.flatMap((item) => {
    if (!item.publicUrl || seen.has(item.publicUrl)) return []
    seen.add(item.publicUrl)
    return [
      {
        type:
          item.mediaType === "video" ? ("video" as const) : ("image" as const),
        src: item.publicUrl,
        alt: item.altText ?? item.title ?? business.name,
        thumbnail:
          item.mediaType === "video" ? business.banner?.publicUrl : undefined,
      },
    ]
  })
}

function buildAddress(business: PublicBusiness) {
  return [
    business.area,
    business.nearestLandmark ? `Near ${business.nearestLandmark}` : undefined,
    business.addressNote,
    business.municipality?.name,
    business.district?.name,
    business.province?.name,
    business.wardNo ? `Ward ${business.wardNo}` : undefined,
  ]
    .filter(Boolean)
    .join(", ")
}

function formatHours(hours: BusinessHour[]) {
  if (!hours?.length) return []

  return hours
    .slice()
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map((hour) => ({
      day: DAY_NAMES[hour.dayOfWeek] ?? `Day ${hour.dayOfWeek}`,
      time: hour.isClosed
        ? "Closed"
        : `${formatBusinessTime(hour.openTime)} - ${formatBusinessTime(hour.closeTime)}`,
      dayOfWeek: hour.dayOfWeek,
    }))
}

const SOCIAL_PLATFORMS: BusinessSocialPlatform[] = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "tiktok",
]

function buildSocialLinks(
  links?: BusinessLinks,
): BusinessSocialLink[] | undefined {
  if (!links) return undefined

  const socialLinks = SOCIAL_PLATFORMS.flatMap((platform) => {
    const url = links[platform]?.trim()
    return url ? [{ platform, url }] : []
  })

  return socialLinks.length > 0 ? socialLinks : undefined
}

function mapAmenities(
  amenities?: BusinessAmenities,
): BusinessVisitInfo["amenities"] {
  if (!amenities) return []

  return [
    amenities.facilities?.wifi ? "wifi" : null,
    amenities.facilities?.parking ? "parking" : null,
    amenities.services?.takeaway ? "takeaway" : null,
    amenities.payment?.card ? "cards" : null,
    amenities.services?.dine_in ? "dineIn" : null,
    amenities.dietary?.vegan ? "vegan" : null,
    amenities.dietary?.non_veg ? "nonVeg" : null,
  ].filter(Boolean) as BusinessVisitInfo["amenities"]
}

function formatReviewDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

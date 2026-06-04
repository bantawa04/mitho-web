import { richBusinessPageData } from "@/features/business/data/business-detail-data"
import type {
  BusinessGalleryItem,
  BusinessPageData,
  BusinessVisitInfo,
} from "@/features/business/business-detail-types"
import type { BusinessAmenities, BusinessHour, PublicBusiness } from "@/types/business"
import type { Media } from "@/types/media"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function mapPublicBusinessToPageData(business: PublicBusiness): BusinessPageData {
  const galleryItems = buildGalleryItems(business)
  const cuisineNames = business.cuisines?.map((cuisine) => cuisine.name).filter(Boolean) ?? []
  const establishmentLabel = business.establishmentType?.label ?? business.municipality?.category?.name ?? "Place"
  const location = [business.area, business.municipality?.name, business.district?.name].filter(Boolean).join(", ")
  const rating = business.ratingAvg ?? richBusinessPageData.rating
  const reviewCount = business.ratingCount > 0 ? business.ratingCount : richBusinessPageData.reviewCount

  return {
    name: business.name,
    sourceBadge: business.ownershipStatus === "claimed" ? "verifiedOwner" : "mitho",
    coverImage: business.banner?.publicUrl ?? galleryItems[0]?.src ?? null,
    rating,
    reviewCount,
    categories: [establishmentLabel, ...cuisineNames].filter(Boolean),
    location: location || business.province?.name || "Location not provided",
    isOpen: isBusinessOpenNow(business.hours),
    heroNote:
      business.description ??
      business.specialityNote ??
      "A Mitho Cha listing with the essentials ready for people looking for a good local place to eat.",
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: business.province?.name ?? "Province", href: `/${business.province?.slug ?? ""}` },
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
    menuItems: richBusinessPageData.menuItems,
    menuLink: richBusinessPageData.menuLink,
    ratingsData: {
      ...richBusinessPageData.ratingsData!,
      averageRating: rating ?? richBusinessPageData.ratingsData!.averageRating,
      totalReviews: reviewCount,
    },
    reviews: richBusinessPageData.reviews,
    addReviewPrompt: richBusinessPageData.addReviewPrompt,
  }
}

export function buildPublicBusinessHref(business: Pick<PublicBusiness, "province" | "district" | "municipality" | "slug">) {
  return `/${business.province.slug}/${business.district.slug}/${business.municipality.slug}/${business.slug}`
}

function buildVisitInfo(business: PublicBusiness, cuisineNames: string[]): BusinessVisitInfo {
  const website = business.links?.website

  return {
    address: buildAddress(business),
    phone: business.phone || undefined,
    website,
    email: business.email,
    coordinates:
      business.latitude !== undefined && business.longitude !== undefined
        ? { lat: business.latitude, lng: business.longitude }
        : undefined,
    mapZoom: 15,
    hours: formatHours(business.hours),
    cuisines: cuisineNames,
    amenities: mapAmenities(business.amenities),
    mapLinkText: "Get directions",
  }
}

function buildGalleryItems(business: PublicBusiness): BusinessGalleryItem[] {
  const media = [business.banner, ...(business.photos ?? [])].filter(Boolean) as Media[]
  const seen = new Set<string>()

  return media.flatMap((item) => {
    if (!item.publicUrl || seen.has(item.publicUrl)) return []
    seen.add(item.publicUrl)
    return [
      {
        type: item.mediaType === "video" ? ("video" as const) : ("image" as const),
        src: item.publicUrl,
        alt: item.altText ?? item.title ?? business.name,
        thumbnail: item.mediaType === "video" ? business.banner?.publicUrl : undefined,
      },
    ]
  })
}

function buildAddress(business: PublicBusiness) {
  return [
    business.addressLine1,
    business.addressLine2,
    business.area,
    business.landmark ? `Near ${business.landmark}` : undefined,
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
      time: hour.isClosed ? "Closed" : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`,
    }))
}

function formatTime(value?: string) {
  if (!value) return "Not provided"
  const [hourPart, minutePart = "00"] = value.split(":")
  const hour = Number(hourPart)
  if (Number.isNaN(hour)) return value
  const period = hour >= 12 ? "PM" : "AM"
  const normalizedHour = hour % 12 || 12
  return `${normalizedHour}:${minutePart.padStart(2, "0")} ${period}`
}

function isBusinessOpenNow(hours: BusinessHour[]) {
  const now = new Date()
  const today = hours.find((hour) => hour.dayOfWeek === now.getDay())
  if (!today || today.isClosed || !today.openTime || !today.closeTime) return false

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = parseMinutes(today.openTime)
  const closeMinutes = parseMinutes(today.closeTime)
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

function parseMinutes(value: string) {
  const [hour = "0", minute = "0"] = value.split(":")
  return Number(hour) * 60 + Number(minute)
}

function mapAmenities(amenities?: BusinessAmenities): BusinessVisitInfo["amenities"] {
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

import type { ExploreResult } from "@/features/discovery/explore/explore-types"
import type { BusinessSearchItem, PublicBusiness } from "@/types/business"

export const SITE_NAME = "Mitho Cha"
export const DEFAULT_OG_IMAGE = "/opengraph-image"
export const DEFAULT_OG_IMAGE_ALT = "Mitho Cha food discovery in Nepal"

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue }

type JsonLdObject = { [key: string]: JsonLdValue }

type ItemListEntry = {
  name: string
  url: string
  image?: string | null
}

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"

  const urlWithProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  return new URL(urlWithProtocol.replace(/\/+$/, ""))
}

export function getAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  const siteUrl = getSiteUrl()
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, siteUrl).toString()
}

export function getBusinessReviewShareTitle(businessName: string) {
  return `Write your review for ${businessName}`
}

export function jsonLdScriptProps(data: JsonLdObject | JsonLdObject[]) {
  return {
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  }
}

export function buildOrganizationJsonLd(): JsonLdObject {
  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl().toString(),
    logo: getAbsoluteUrl("/brand/logo-primary-green.svg"),
  })
}

export function buildWebSiteJsonLd(): JsonLdObject {
  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl().toString(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getAbsoluteUrl("/explore")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  })
}

export function buildBusinessJsonLd(business: PublicBusiness, publicPath: string): JsonLdObject {
  const imageUrls = getBusinessImageUrls(business)
  const addressParts = [
    business.area,
    business.nearestLandmark ? `Near ${business.nearestLandmark}` : undefined,
    business.addressNote,
    business.wardNo ? `Ward ${business.wardNo}` : undefined,
  ].filter(Boolean)
  const sameAs = [
    business.links?.website,
    business.links?.facebook,
    business.links?.instagram,
    business.links?.twitter,
    business.links?.youtube,
    business.links?.tiktok,
  ].filter(Boolean)

  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    url: getAbsoluteUrl(publicPath),
    image: imageUrls.length ? imageUrls.map(getAbsoluteUrl) : [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
    description:
      business.description ??
      business.specialityNote ??
      `Discover ${business.name} on ${SITE_NAME}.`,
    telephone: business.phone || undefined,
    priceRange: business.priceRange ? "$".repeat(Math.max(1, business.priceRange)) : undefined,
    servesCuisine: business.cuisines?.map((cuisine) => cuisine.name).filter(Boolean),
    sameAs: sameAs.length ? sameAs : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressParts.join(", ") || undefined,
      addressLocality: business.municipality?.name,
      addressRegion: business.province?.name,
      addressCountry: "NP",
    },
    geo:
      business.latitude !== undefined && business.longitude !== undefined
        ? {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          }
        : undefined,
    openingHoursSpecification: buildOpeningHoursSpecification(business),
    aggregateRating:
      business.ratingCount > 0 && business.ratingAvg !== undefined && business.ratingAvg !== null
        ? {
            "@type": "AggregateRating",
            ratingValue: business.ratingAvg,
            reviewCount: business.ratingCount,
          }
        : undefined,
  })
}

export function buildItemListJsonLd(name: string, items: ItemListEntry[]): JsonLdObject | null {
  const itemListElement = items
    .filter((item) => item.name && item.url)
    .map((item, index) =>
      compactJsonLd({
        "@type": "ListItem",
        position: index + 1,
        url: getAbsoluteUrl(item.url),
        name: item.name,
        image: item.image ? getAbsoluteUrl(item.image) : undefined,
      }),
    )

  if (!itemListElement.length) return null

  return compactJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement,
  })
}

export function businessSearchItemsToItemListEntries(items: BusinessSearchItem[]): ItemListEntry[] {
  return items.map((business) => ({
    name: business.name,
    url: business.publicPath,
    image: business.coverImage,
  }))
}

export function exploreResultsToItemListEntries(items: ExploreResult[]): ItemListEntry[] {
  return items.map((result) => ({
    name: result.name,
    url: result.publicHref,
    image: result.imageUrl,
  }))
}

function getBusinessImageUrls(business: PublicBusiness) {
  return [
    business.banner?.publicUrl,
    ...(business.photos ?? [])
      .filter((photo) => photo.mediaType === "image")
      .map((photo) => photo.publicUrl),
  ].filter((url): url is string => Boolean(url))
}

function buildOpeningHoursSpecification(business: PublicBusiness) {
  const specs = business.hours
    ?.filter((hour) => !hour.isClosed && hour.openTime && hour.closeTime)
    .map((hour) =>
      compactJsonLd({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_NAMES[hour.dayOfWeek],
        opens: hour.openTime,
        closes: hour.closeTime,
      }),
    )

  return specs?.length ? specs : undefined
}

function compactJsonLd<T extends JsonLdObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
      .map(([key, entryValue]) => [
        key,
        isPlainJsonLdObject(entryValue) ? compactJsonLd(entryValue) : entryValue,
      ]),
  ) as T
}

function isPlainJsonLdObject(value: JsonLdValue): value is JsonLdObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

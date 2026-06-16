import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { searchBusinesses } from "@/lib/api/businesses"
import { resolveProvince } from "@/lib/api/geography"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  buildItemListJsonLd,
  businessSearchItemsToItemListEntries,
  getAbsoluteUrl,
  jsonLdScriptProps,
} from "@/lib/seo"
import type { BusinessSearchItem } from "@/types/business"
import type { GeographyResolution } from "@/types/nepal-admin"

interface ProvinceListingRouteProps {
  params: Promise<{ province: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ProvinceListingRouteProps): Promise<Metadata> {
  const { province: provinceSlug } = await params
  const geo = await fetchGeo(provinceSlug)
  if (!geo) return { title: "Not Found | Mitho Cha" }
  const { name, slug } = geo.province
  const title = `Restaurants & Food Places in ${name} | Mitho Cha`
  const description = `Discover restaurants, cafes, and local food spots across ${name}, Nepal. Real reviews and trust signals from local food lovers.`
  const canonical = `/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(DEFAULT_OG_IMAGE),
          width: 1200,
          height: 630,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
    },
  }
}

export default async function ProvinceListingRoute({ params }: ProvinceListingRouteProps) {
  const { province: provinceSlug } = await params
  const geo = await fetchGeo(provinceSlug)
  if (!geo) notFound()
  const businesses = await fetchGeoBusinessesForSeo(geo)
  const itemListJsonLd = buildItemListJsonLd(
    `Food places in ${geo.province.name}`,
    businessSearchItemsToItemListEntries(businesses),
  )

  return (
    <>
      {itemListJsonLd ? (
        <script type="application/ld+json" {...jsonLdScriptProps(itemListJsonLd)} />
      ) : null}
      <GeoListingPage geoContext={geo} />
    </>
  )
}

async function fetchGeo(provinceSlug: string): Promise<GeographyResolution | null> {
  try {
    return await resolveProvince(provinceSlug)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

async function fetchGeoBusinessesForSeo(geo: GeographyResolution): Promise<BusinessSearchItem[]> {
  try {
    const response = await searchBusinesses({
      provinceId: geo.province.id,
      page: 1,
      perPage: 6,
      sort: "recommended",
    })
    return response.items
  } catch {
    return []
  }
}

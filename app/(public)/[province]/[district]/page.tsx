import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { searchBusinesses } from "@/lib/api/businesses"
import { resolveDistrict } from "@/lib/api/geography"
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

interface DistrictListingRouteProps {
  params: Promise<{ province: string; district: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: DistrictListingRouteProps): Promise<Metadata> {
  const { province: provinceSlug, district: districtSlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug)
  if (!geo || !geo.district) return { title: "Not Found | Mitho Cha" }
  const { name: districtName, slug: districtSlugResolved } = geo.district
  const { name: provinceName, slug: provinceSlugResolved } = geo.province
  const title = `Food Places in ${districtName} District, ${provinceName} | Mitho Cha`
  const description = `Discover restaurants, cafes, and local food spots in ${districtName} District, ${provinceName}, Nepal.`
  const canonical = `/${provinceSlugResolved}/${districtSlugResolved}`

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

export default async function DistrictListingRoute({ params }: DistrictListingRouteProps) {
  const { province: provinceSlug, district: districtSlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug)
  if (!geo) notFound()
  const businesses = await fetchGeoBusinessesForSeo(geo)
  const itemListJsonLd = buildItemListJsonLd(
    `Food places in ${geo.district?.name ?? geo.province.name}`,
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

async function fetchGeo(provinceSlug: string, districtSlug: string): Promise<GeographyResolution | null> {
  try {
    return await resolveDistrict(provinceSlug, districtSlug)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

async function fetchGeoBusinessesForSeo(geo: GeographyResolution): Promise<BusinessSearchItem[]> {
  try {
    const response = await searchBusinesses({
      provinceId: geo.province.id,
      districtId: geo.district?.id,
      page: 1,
      perPage: 6,
      sort: "recommended",
    })
    return response.items
  } catch {
    return []
  }
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { searchBusinesses } from "@/lib/api/businesses"
import { resolveMunicipality } from "@/lib/api/geography"
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

interface MunicipalityListingRouteProps {
  params: Promise<{ province: string; district: string; city: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: MunicipalityListingRouteProps): Promise<Metadata> {
  const { province: provinceSlug, district: districtSlug, city: citySlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug, citySlug)
  if (!geo || !geo.municipality) return { title: "Not Found | Mitho Cha" }
  const { name: municipalityName, slug: citySlugResolved } = geo.municipality
  const { name: provinceName, slug: provinceSlugResolved } = geo.province
  const { slug: districtSlugResolved } = geo.district!
  const title = `Restaurants in ${municipalityName} | Mitho Cha`
  const description = `Discover restaurants, cafes, and local food spots in ${municipalityName}, ${provinceName}, Nepal.`
  const canonical = `/${provinceSlugResolved}/${districtSlugResolved}/${citySlugResolved}`

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

export default async function MunicipalityListingRoute({ params }: MunicipalityListingRouteProps) {
  const { province: provinceSlug, district: districtSlug, city: citySlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug, citySlug)
  if (!geo) notFound()
  const businesses = await fetchGeoBusinessesForSeo(geo)
  const itemListJsonLd = buildItemListJsonLd(
    `Food places in ${geo.municipality?.name ?? geo.province.name}`,
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

async function fetchGeo(
  provinceSlug: string,
  districtSlug: string,
  citySlug: string,
): Promise<GeographyResolution | null> {
  try {
    return await resolveMunicipality(provinceSlug, districtSlug, citySlug)
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
      municipalityId: geo.municipality?.id,
      page: 1,
      perPage: 6,
      sort: "recommended",
    })
    return response.items
  } catch {
    return []
  }
}

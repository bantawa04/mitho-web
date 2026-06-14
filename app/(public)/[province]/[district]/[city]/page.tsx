import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { resolveMunicipality } from "@/lib/api/geography"
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
  return {
    title: `Restaurants in ${municipalityName} | Mitho Cha`,
    description: `Discover restaurants, cafes, and local food spots in ${municipalityName}, ${provinceName}, Nepal.`,
    alternates: {
      canonical: `/${provinceSlugResolved}/${districtSlugResolved}/${citySlugResolved}`,
    },
  }
}

export default async function MunicipalityListingRoute({ params }: MunicipalityListingRouteProps) {
  const { province: provinceSlug, district: districtSlug, city: citySlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug, citySlug)
  if (!geo) notFound()
  return <GeoListingPage geoContext={geo} />
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

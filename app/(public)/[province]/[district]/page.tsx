import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { resolveDistrict } from "@/lib/api/geography"
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
  return {
    title: `Food Places in ${districtName} District, ${provinceName} | Mitho Cha`,
    description: `Discover restaurants, cafes, and local food spots in ${districtName} District, ${provinceName}, Nepal.`,
    alternates: { canonical: `/${provinceSlugResolved}/${districtSlugResolved}` },
  }
}

export default async function DistrictListingRoute({ params }: DistrictListingRouteProps) {
  const { province: provinceSlug, district: districtSlug } = await params
  const geo = await fetchGeo(provinceSlug, districtSlug)
  if (!geo) notFound()
  return <GeoListingPage geoContext={geo} />
}

async function fetchGeo(provinceSlug: string, districtSlug: string): Promise<GeographyResolution | null> {
  try {
    return await resolveDistrict(provinceSlug, districtSlug)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

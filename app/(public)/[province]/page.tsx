import type { Metadata } from "next"
import { notFound } from "next/navigation"
import axios from "axios"
import { GeoListingPage } from "@/features/discovery/geo-listing/geo-listing-page"
import { resolveProvince } from "@/lib/api/geography"
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
  return {
    title: `Restaurants & Food Places in ${name} | Mitho Cha`,
    description: `Discover restaurants, cafes, and local food spots across ${name}, Nepal. Real reviews and trust signals from local food lovers.`,
    alternates: { canonical: `/${slug}` },
  }
}

export default async function ProvinceListingRoute({ params }: ProvinceListingRouteProps) {
  const { province: provinceSlug } = await params
  const geo = await fetchGeo(provinceSlug)
  if (!geo) notFound()
  return <GeoListingPage geoContext={geo} />
}

async function fetchGeo(provinceSlug: string): Promise<GeographyResolution | null> {
  try {
    return await resolveProvince(provinceSlug)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

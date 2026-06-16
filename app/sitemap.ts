import type { MetadataRoute } from "next"
import { CATEGORY_METADATA } from "@/content/taxonomy/category-taxonomy"
import { CITY_METADATA } from "@/content/taxonomy/city-taxonomy"
import { searchBusinesses } from "@/lib/api/businesses"
import { getAbsoluteUrl } from "@/lib/seo"

export const revalidate = 3600

const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/add-business",
  "/business/claim",
  "/careers",
  "/contact",
  "/explore",
  "/guidelines",
  "/help",
  "/privacy",
  "/terms",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries = [
    ...STATIC_PUBLIC_ROUTES,
    ...CATEGORY_METADATA.map((category) => `/categories/${category.slug}`),
    ...CITY_METADATA.map((city) => `/cities/${city.slug}`),
  ].map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? ("daily" as const) : ("weekly" as const),
    priority: route === "/" ? 1 : 0.7,
  }))

  const businessEntries = await getBusinessEntries(now)
  const seen = new Set<string>()

  return [...staticEntries, ...businessEntries].filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

async function getBusinessEntries(now: Date): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await searchBusinesses({
      page: 1,
      perPage: 100,
      sort: "latest",
    })

    return response.items
      .filter((business) => business.publicPath)
      .map((business) => ({
        url: getAbsoluteUrl(business.publicPath),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch {
    return []
  }
}

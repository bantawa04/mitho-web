import type { Business } from "@/types/business"

/**
 * Derives the public listing href for a business.
 * Matches the same logic used in the business switcher page.
 */
export function getPublicBusinessHref(business: Pick<Business, "slug" | "province" | "district" | "municipality">): string {
  if (business.province?.slug && business.district?.slug && business.municipality?.slug) {
    return `/${business.province.slug}/${business.district.slug}/${business.municipality.slug}/${business.slug}`
  }
  return `/business/${business.slug}`
}

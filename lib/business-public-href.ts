/**
 * Derives the public listing href for a business.
 * Matches the same logic used in the business switcher page.
 */
export function getPublicBusinessHref(business: {
  slug: string
  province?: { slug?: string }
  district?: { slug?: string }
  municipality?: { slug?: string }
}): string {
  if (business.province?.slug && business.district?.slug && business.municipality?.slug) {
    return `/${business.province.slug}/${business.district.slug}/${business.municipality.slug}/${business.slug}`
  }
  return `/business/${business.slug}`
}

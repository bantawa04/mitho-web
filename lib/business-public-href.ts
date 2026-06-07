/**
 * Derives the public listing href for a business.
 * Matches the same logic used in the business switcher page.
 */
export function getPublicBusinessHref(business: {
  slug: string
  publicPath?: string
  provinceSlug?: string
  districtSlug?: string
  municipalitySlug?: string
  province?: { slug?: string } | string
  district?: { slug?: string } | string
  municipality?: { slug?: string } | string
}): string {
  if (business.publicPath) {
    return business.publicPath
  }

  const provinceSlug = typeof business.province === "object" ? business.province?.slug : undefined
  const districtSlug = typeof business.district === "object" ? business.district?.slug : undefined
  const municipalitySlug = typeof business.municipality === "object" ? business.municipality?.slug : undefined

  const finalProvinceSlug = provinceSlug ?? business.provinceSlug
  const finalDistrictSlug = districtSlug ?? business.districtSlug
  const finalMunicipalitySlug = municipalitySlug ?? business.municipalitySlug

  if (finalProvinceSlug && finalDistrictSlug && finalMunicipalitySlug) {
    return `/${finalProvinceSlug}/${finalDistrictSlug}/${finalMunicipalitySlug}/${business.slug}`
  }
  return `/business/${business.slug}`
}

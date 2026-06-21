/**
 * Derives the public listing href for a business.
 * Matches the same logic used in the business switcher page.
 */
export function getPublicBusinessHref(business: {
  id?: string
  slug: string
  publicPath?: string | null
  provinceSlug?: string
  districtSlug?: string
  municipalitySlug?: string
  province?: { slug?: string } | string | null
  district?: { slug?: string } | string | null
  municipality?: { slug?: string } | string | null
}): string | null {
  const publicPath = business.publicPath?.trim()
  if (publicPath) {
    return publicPath.startsWith("/") ? publicPath : `/${publicPath}`
  }

  const provinceSlug =
    typeof business.province === "object" ? business.province?.slug : undefined
  const districtSlug =
    typeof business.district === "object" ? business.district?.slug : undefined
  const municipalitySlug =
    typeof business.municipality === "object"
      ? business.municipality?.slug
      : undefined

  const finalProvinceSlug = provinceSlug ?? business.provinceSlug
  const finalDistrictSlug = districtSlug ?? business.districtSlug
  const finalMunicipalitySlug = municipalitySlug ?? business.municipalitySlug
  const cleanId = business.id?.trim()

  const cleanSlug = business.slug.trim()
  if (
    finalProvinceSlug &&
    finalDistrictSlug &&
    finalMunicipalitySlug &&
    cleanId &&
    cleanSlug
  ) {
    return `/${finalProvinceSlug}/${finalDistrictSlug}/${finalMunicipalitySlug}/${cleanId}-${cleanSlug}`
  }
  return null
}

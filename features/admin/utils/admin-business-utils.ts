import { getPublicBusinessHref } from "@/lib/business-public-href"
import type { Business } from "@/types/business"
import type { BusinessClaim, BusinessClaimBusinessSummary } from "@/types/business-claims"

type AdminBusinessLocationShape = {
  area?: string
  nearestLandmark?: string
  addressNote?: string
  municipality?: { name?: string }
  district?: { name?: string }
  province?: { name?: string }
}

export function formatAdminBusinessLocation(business?: AdminBusinessLocationShape | null) {
  if (!business) return "Location not provided"
  return [
    business.area,
    business.nearestLandmark ? `Near ${business.nearestLandmark}` : undefined,
    business.addressNote,
    business.municipality?.name,
    business.district?.name,
    business.province?.name,
  ]
    .filter(Boolean)
    .join(", ")
}

export function formatAdminBusinessTableLocation(business: Pick<Business, "municipality" | "district">) {
  return `${business.municipality.name}, ${business.district.name}`
}

export function getAdminBusinessPublicHref(
  business:
    | Pick<Business, "slug" | "province" | "district" | "municipality">
    | BusinessClaimBusinessSummary
    | { slug: string; province?: { slug?: string }; district?: { slug?: string }; municipality?: { slug?: string } },
) {
  return getPublicBusinessHref(business)
}

export function formatAdminClaimBusinessLocation(claim: Pick<BusinessClaim, "business">) {
  return formatAdminBusinessLocation(claim.business)
}

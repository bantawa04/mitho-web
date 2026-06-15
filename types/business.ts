import type { Media } from "@/types/media"
import type { Cuisine } from "@/types/cuisine"
import type { EstablishmentType } from "@/types/establishment-types"
import type { District, Municipality, Province } from "@/types/nepal-admin"

export interface AmenityServices {
  dine_in?: boolean
  takeaway?: boolean
  delivery?: boolean
}

export interface AmenityPayment {
  cash?: boolean
  card?: boolean
  esewa?: boolean
  khalti?: boolean
  qr?: boolean
}

export interface AmenityFacilities {
  parking?: boolean
  wifi?: boolean
  air_conditioning?: boolean
  outdoor_seating?: boolean
  service_charge?: boolean
}

export interface AmenityDietary {
  vegetarian?: boolean
  vegan?: boolean
  halal?: boolean
  non_veg?: boolean
}

export interface BusinessAmenities {
  services?: AmenityServices
  payment?: AmenityPayment
  facilities?: AmenityFacilities
  dietary?: AmenityDietary
}

export interface BusinessLinks {
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
}

export interface BusinessHour {
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
}

export interface ReplaceHoursPayload {
  hours: BusinessHour[]
}

export type BusinessStatus = "pending" | "active" | "suspended" | "rejected"
export type BusinessListingStatus = "pending_review" | "published" | "suspended" | "rejected"
export type BusinessOwnershipStatus = "unclaimed" | "claim_under_review" | "claimed"

export interface BusinessPendingClaim {
  id: string
  status: "pending"
  claimantName: string
  createdAt: string
}

export interface Business {
  id: string
  name: string
  slug: string
  description?: string
  logo?: Media
  banner?: Media
  photos?: Media[]
  email?: string
  phone: string
  phoneSecondary?: string
  provinceId: number
  districtId: number
  municipalityId: number
  wardNo: number
  province: Pick<Province, "id" | "name" | "slug">
  district: Pick<District, "id" | "name" | "slug">
  municipality: Pick<Municipality, "id" | "name" | "slug" | "wards"> & {
    category: Municipality["category"]
  }
  area?: string
  nearestLandmark?: string
  addressNote?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  establishmentTypeId?: string
  establishmentType?: EstablishmentType
  cuisines?: Cuisine[]
  signatureItems?: string[]
  mealTypes?: string[]
  menuUrl?: string
  specialityNote?: string
  priceRange?: number
  avgCostPerPerson?: number
  amenities?: BusinessAmenities
  links?: BusinessLinks
  status: BusinessStatus
  listingStatus: BusinessListingStatus
  ownershipStatus: BusinessOwnershipStatus
  pendingClaim?: BusinessPendingClaim
  addedByType: string
  addedByUserId?: string
  addedByUserName?: string
  ratingAvg?: number
  ratingCount: number
  isFeatured: boolean
  claimInvitationRequested?: boolean
  claimInvitationEmail?: string | null
  claimInvitationSentAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface PublicBusiness extends Business {
  hours: BusinessHour[]
}

export interface MyBusinessEntry {
  business: Business
  membershipRole?: string
  membershipStatus?: string
  claimStatus?: string
  claimId?: string
}

export interface CreateBusinessPayload {
  name: string
  phone: string
  provinceId: number
  districtId: number
  municipalityId: number
  wardNo: number
  area?: string
  description?: string
  logoId?: string
  bannerId?: string
  photos?: string[]
  email?: string
  phoneSecondary?: string
  nearestLandmark?: string
  addressNote?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  establishmentTypeId?: string
  cuisineIds?: string[]
  signatureItems?: string[]
  mealTypes?: string[]
  menuUrl?: string
  specialityNote?: string
  priceRange?: number
  avgCostPerPerson?: number
  amenities?: BusinessAmenities
  links?: BusinessLinks
  status?: BusinessStatus
  listingStatus?: BusinessListingStatus
  isFeatured?: boolean
  sendClaimInvitation?: boolean
  claimInvitationEmail?: string | null
}

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>

export interface ListBusinessesParams {
  status?: BusinessStatus
  listingStatus?: BusinessListingStatus
  ownershipStatus?: BusinessOwnershipStatus
  search?: string
  page?: number
  pageSize?: number
}

export type BusinessSearchSort = "recommended" | "top_rated" | "most_reviewed"

/**
 * Frontend-facing params for the public business search endpoint.
 * Mapped to snake_case query params inside `searchBusinesses`.
 */
export interface SearchBusinessesParams {
  q?: string
  establishmentTypeId?: string
  cuisineId?: string
  provinceId?: number
  districtId?: number
  municipalityId?: number
  openNow?: boolean
  sort?: BusinessSearchSort
  page?: number
  perPage?: number
}

/**
 * A single result row from `GET /api/businesses/search`.
 * Mirrors the pinned API contract (all camelCase).
 */
export interface BusinessSearchItem {
  id: string
  name: string
  slug: string
  publicPath: string
  coverImage: string | null
  establishmentType?: EstablishmentType | null
  cuisines?: Cuisine[]
  area?: string | null
  wardNo?: number | null
  province?: Pick<Province, "id" | "name" | "slug"> | null
  district?: Pick<District, "id" | "name" | "slug"> | null
  municipality?:
    | (Pick<Municipality, "id" | "name" | "slug" | "wards"> & {
        category: Municipality["category"]
      })
    | null
  priceRange?: number | null
  ratingAvg?: number | null
  ratingCount: number
  isFeatured: boolean
  isOpenNow: boolean
}

export interface BusinessSearchMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface BusinessSearchResponse {
  items: BusinessSearchItem[]
  meta: BusinessSearchMeta
}

import type { Media } from "@/types/media"
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

export type BusinessStatus = "pending" | "active" | "suspended" | "rejected"
export type BusinessListingStatus = "pending_review" | "published" | "suspended" | "rejected"
export type BusinessOwnershipStatus = "unclaimed" | "claim_under_review" | "claimed"

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
  province: Pick<Province, "id" | "name">
  district: Pick<District, "id" | "name">
  municipality: Pick<Municipality, "id" | "name" | "wards"> & {
    category: Municipality["category"]
  }
  area?: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  establishmentTypeId?: string
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
  addedByType: string
  addedByUserId?: string
  ratingAvg?: number
  ratingCount: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBusinessPayload {
  name: string
  phone: string
  provinceId: number
  districtId: number
  municipalityId: number
  wardNo: number
  addressLine1: string
  description?: string
  logoId?: string
  bannerId?: string
  photos?: string[]
  email?: string
  phoneSecondary?: string
  area?: string
  addressLine2?: string
  landmark?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  establishmentTypeId?: string
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

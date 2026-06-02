import type { Media } from "@/types/media"

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
  state: string
  district: string
  city: string
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
  slug: string
  phone: string
  state: string
  district: string
  city: string
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
  isFeatured?: boolean
}

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>

export interface ListBusinessesParams {
  status?: BusinessStatus
  search?: string
  page?: number
  pageSize?: number
}

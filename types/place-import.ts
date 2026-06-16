import type { BusinessListingStatus, BusinessOwnershipStatus } from "@/types/business"
import type { MunicipalityCategory } from "@/types/nepal-admin"

export type PlaceImportCategoryValue = "restaurant" | "cafe" | "bakery" | "bar" | "meal_takeaway" | "night_club"

export interface PlaceImportCategory {
  value: PlaceImportCategoryValue
  label: string
}

// Mirror of backend place_import.ImportCategories (the backend is the source of
// truth and validates the selected categories on search).
export const PLACE_IMPORT_CATEGORIES: PlaceImportCategory[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe / Coffee shop" },
  { value: "bakery", label: "Bakery" },
  { value: "bar", label: "Bar" },
  { value: "meal_takeaway", label: "Fast food" },
  { value: "night_club", label: "Night club" },
]

export interface PlaceImportRef {
  id: number
  name: string
  slug: string
}

export interface PlaceImportMunicipalityRef extends PlaceImportRef {
  wards: number
  category: MunicipalityCategory
}

export interface PlaceImportBusinessRef {
  id: string
  name: string
  slug: string
  publicPath: string
  phone: string
  listingStatus: BusinessListingStatus
  ownershipStatus: BusinessOwnershipStatus
  province: PlaceImportRef
  district: PlaceImportRef
  municipality: PlaceImportMunicipalityRef
}

export interface PlaceSearchResult {
  externalId: string
  name: string
  formattedAddress?: string
  phone?: string
  website?: string
  googleMapsUrl?: string
  latitude?: number
  longitude?: number
  rating?: number
  reviewCount?: number
  primaryType?: string
  types: string[]
  suggestedEstablishmentTypeId?: string
  alreadyImported: boolean
  existingBusiness?: PlaceImportBusinessRef
}

export interface SearchGooglePlacesPayload {
  latitude: number
  longitude: number
  radiusMeters: number
  categories: string[]
  maxResults?: number
}

export interface ImportGooglePlaceItem {
  externalId: string
  name: string
  phone?: string
  website?: string
  googleMapsUrl?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  establishmentTypeId?: string
  provinceId: number
  districtId: number
  municipalityId: number
  wardNo: number
  area?: string
  addressNote?: string
}

export interface ImportGooglePlacesPayload {
  items: ImportGooglePlaceItem[]
}

export type ImportPlaceOutcomeStatus = "created" | "skipped_duplicate" | "failed"

export interface ImportPlaceResult {
  externalId: string
  name: string
  status: ImportPlaceOutcomeStatus
  businessId?: string
  message?: string
}

export interface ImportGooglePlacesResult {
  created: number
  skippedDuplicate: number
  failed: number
  items: ImportPlaceResult[]
}

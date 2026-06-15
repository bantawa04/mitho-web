import type { Business, BusinessListingStatus, BusinessOwnershipStatus } from "@/types/business"
import type { EstablishmentType } from "@/types/establishment-types"
import type { MunicipalityCategory } from "@/types/nepal-admin"

export type PlaceImportSource = "google_places"
export type PlaceImportBatchStatus = "fetched" | "failed"
export type PlaceImportDuplicateStatus = "pending" | "warning" | "matched" | "clear"
export type PlaceImportAddressReviewStatus = "pending" | "normalized" | "needs_attention"
export type PlaceImportStatus = "pending" | "imported" | "rejected"

export interface PlaceImportBatch {
  id: string
  source: PlaceImportSource
  query: string
  latitude?: number
  longitude?: number
  radiusMeters?: number
  status: PlaceImportBatchStatus
  fetchedCount: number
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface PlaceImportProvinceRef {
  id: number
  name: string
  slug: string
}

export interface PlaceImportDistrictRef {
  id: number
  name: string
  slug: string
}

export interface PlaceImportMunicipalityRef {
  id: number
  name: string
  slug: string
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
  province: PlaceImportProvinceRef
  district: PlaceImportDistrictRef
  municipality: PlaceImportMunicipalityRef
}

export interface PlaceImportRawSnapshot {
  id: string
  name: string
  externalId: string
  formattedAddress?: string
  phone?: string
  website?: string
  googleMapsUrl?: string
  latitude?: number
  longitude?: number
  rating?: number
  reviewCount?: number
  businessStatus?: string
  primaryType?: string
  types: string[]
  photoRefs: string[]
  rawPayload: Record<string, unknown>
  lastSeenAt: string
}

export interface PlaceImportCandidate {
  id: string
  batch: PlaceImportBatch
  source: PlaceImportSource
  externalId: string
  name: string
  slugSuggestion?: string
  phone?: string
  website?: string
  formattedAddress?: string
  addressLine1?: string
  addressLine2?: string
  provinceId?: number
  districtId?: number
  municipalityId?: number
  wardNo?: number
  province: PlaceImportProvinceRef
  district: PlaceImportDistrictRef
  municipality: PlaceImportMunicipalityRef
  latitude?: number
  longitude?: number
  rating?: number
  reviewCount?: number
  businessStatus?: string
  googleTypes: string[]
  photoRefs: string[]
  suggestedEstablishmentTypeId?: string
  suggestedEstablishmentType?: EstablishmentType
  duplicateCheckStatus: PlaceImportDuplicateStatus
  addressReviewStatus: PlaceImportAddressReviewStatus
  importStatus: PlaceImportStatus
  adminNotes?: string
  rejectionNote?: string
  reviewedAt?: string
  importedAt?: string
  matchedBusiness?: PlaceImportBusinessRef
  importedBusiness?: PlaceImportBusinessRef
  duplicateHints: PlaceImportBusinessRef[]
  raw: PlaceImportRawSnapshot
  createdAt: string
  updatedAt: string
}

export interface ListPlaceImportCandidatesParams {
  batchId?: string
  status?: PlaceImportStatus | "all"
  duplicateStatus?: PlaceImportDuplicateStatus | "all"
  search?: string
}

export interface SearchPlaceImportPayload {
  query: string
  latitude?: number
  longitude?: number
  radiusMeters?: number
  maxResults?: number
}

export interface UpdatePlaceImportCandidatePayload {
  name?: string
  phone?: string
  website?: string
  formattedAddress?: string
  addressLine1?: string
  addressLine2?: string
  provinceId?: number
  districtId?: number
  municipalityId?: number
  wardNo?: number
  latitude?: number
  longitude?: number
  establishmentTypeId?: string
  adminNotes?: string
}

export interface MatchPlaceImportCandidatePayload {
  businessId: string
  note?: string
}

export interface ImportPlaceImportCandidatePayload {
  forceDuplicateOverride?: boolean
}

export interface RejectPlaceImportCandidatePayload {
  note?: string
}

export type PlaceImportCandidateSummary = Pick<
  PlaceImportCandidate,
  | "id"
  | "name"
  | "phone"
  | "formattedAddress"
  | "provinceId"
  | "districtId"
  | "municipalityId"
  | "wardNo"
  | "duplicateCheckStatus"
  | "addressReviewStatus"
  | "importStatus"
  | "matchedBusiness"
  | "importedBusiness"
  | "duplicateHints"
  | "createdAt"
  | "updatedAt"
>

export type PlaceImportLinkedBusiness = Pick<
  Business,
  "id" | "name" | "slug" | "phone" | "listingStatus" | "ownershipStatus"
>

import type { Media, MediaUploadTicket } from "@/types/media"

export type BusinessClaimStatus = "pending" | "approved" | "rejected"
export type BusinessClaimStatusFilter = "all" | BusinessClaimStatus

export interface ClaimableBusiness {
  id: string
  name: string
  slug: string
  publicPath: string
  area?: string
  addressLine1: string
  province: string
  provinceSlug: string
  district: string
  districtSlug: string
  municipality: string
  municipalitySlug: string
  establishmentType?: string
  cuisines?: string[]
  logo?: Media
  banner?: Media
}

export interface BusinessClaimUserSummary {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface BusinessClaimBusinessSummary {
  id: string
  name: string
  slug: string
  province?: { name: string; slug: string }
  district?: { name: string; slug: string }
  municipality?: { name: string; slug: string }
  addressLine1?: string
  area?: string
  phone?: string
  email?: string
  ownershipStatus?: string
}

export interface BusinessClaim {
  id: string
  businessId: string
  business?: BusinessClaimBusinessSummary
  userId: string
  user?: BusinessClaimUserSummary
  status: BusinessClaimStatus
  claimantName: string
  role: string
  businessPhone: string
  businessEmail: string
  panVatNumber: string
  documentMediaIds?: string[]
  documents?: Media[]
  note?: string
  reviewNote?: string
  reviewedBy?: string
  reviewer?: BusinessClaimUserSummary
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ListBusinessClaimsParams {
  status?: BusinessClaimStatusFilter
  search?: string
  page?: number
  perPage?: number
}

export interface BusinessClaimsListResponse {
  items: BusinessClaim[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface CreateBusinessClaimPayload {
  claimantName: string
  role: string
  businessPhone: string
  businessEmail: string
  panVatNumber: string
  documentMediaIds: string[]
  note?: string
}

export interface BusinessClaimDecisionPayload {
  reviewNote?: string
}

export interface PrivateMediaAccess {
  url: string
  expiresAt: string
}

export type ClaimDocumentUploadTicket = MediaUploadTicket

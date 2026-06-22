export type BusinessReportReason =
  | "phone"
  | "address"
  | "hours"
  | "website_social"
  | "business_closed"
  | "duplicate"
  | "wrong_photos"
  | "other"

export type BusinessReportStatus = "pending" | "resolved" | "rejected"

export interface CreateBusinessReportPayload {
  reason: BusinessReportReason
  suggestedCorrection?: string
  note?: string
  reporterEmail?: string
}

export interface ResolveBusinessReportPayload {
  resolutionNote: string
}

export interface BusinessReportBusinessSummary {
  id: string
  name: string
  slug: string
  publicHref?: string
}

export interface BusinessReportReporter {
  userId?: string
  name?: string
  email?: string
}

export interface BusinessInformationReport {
  id: string
  businessId: string
  business: BusinessReportBusinessSummary
  reason: BusinessReportReason
  suggestedCorrection?: string
  note?: string
  reporterEmail?: string
  reporter?: BusinessReportReporter
  status: BusinessReportStatus
  resolutionNote?: string
  resolvedBy?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ListAdminBusinessReportsParams {
  page?: number
  perPage?: number
  status?: BusinessReportStatus | ""
  reason?: BusinessReportReason | ""
  businessId?: string
  search?: string
}

export interface AdminBusinessReportListResponse {
  items: BusinessInformationReport[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

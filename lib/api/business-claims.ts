import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type { CreateUploadPayload } from "@/types/media"
import type {
  BusinessClaim,
  BusinessClaimDecisionPayload,
  BusinessClaimsListResponse,
  ClaimableBusiness,
  ClaimDocumentUploadTicket,
  CreateBusinessClaimPayload,
  ListBusinessClaimsParams,
  PrivateMediaAccess,
} from "@/types/business-claims"

export async function searchClaimableBusinesses(search: string, limit = 20): Promise<ClaimableBusiness[]> {
  const { data } = await API.get<ISuccessResponse<ClaimableBusiness[]>>("/business-claims/claimable-businesses", {
    params: { search, limit },
  })
  return data.data
}

export async function getClaimableBusiness(id: string): Promise<ClaimableBusiness> {
  const { data } = await API.get<ISuccessResponse<ClaimableBusiness>>(`/business-claims/claimable-businesses/${id}`)
  return data.data
}

export async function requestClaimDocumentUpload(payload: CreateUploadPayload): Promise<ClaimDocumentUploadTicket> {
  const { data } = await API.post<ISuccessResponse<ClaimDocumentUploadTicket>>("/business-claims/documents", payload)
  return data.data
}

export async function confirmClaimDocumentUpload(id: string) {
  const { data } = await API.post<ISuccessResponse<ClaimDocumentUploadTicket["media"]>>(`/business-claims/documents/${id}/confirm`)
  return data.data
}

export async function createBusinessClaim(businessId: string, payload: CreateBusinessClaimPayload): Promise<BusinessClaim> {
  const { data } = await API.post<ISuccessResponse<BusinessClaim>>(`/businesses/${businessId}/claims`, payload)
  return data.data
}

export async function listAdminBusinessClaims(params: ListBusinessClaimsParams): Promise<BusinessClaimsListResponse> {
  const requestParams = {
    status: params.status,
    search: params.search,
    business_id: params.businessId,
    page: params.page,
    per_page: params.perPage,
  }
  const { data } = await API.get<ISuccessResponse<BusinessClaimsListResponse>>("/admin/business-claims", {
    params: requestParams,
  })
  return data.data
}

export async function getAdminBusinessClaim(id: string): Promise<BusinessClaim> {
  const { data } = await API.get<ISuccessResponse<BusinessClaim>>(`/admin/business-claims/${id}`)
  return data.data
}

export async function approveAdminBusinessClaim(id: string, payload: BusinessClaimDecisionPayload): Promise<void> {
  await API.put(`/admin/business-claims/${id}/approve`, payload)
}

export async function rejectAdminBusinessClaim(id: string, payload: BusinessClaimDecisionPayload): Promise<void> {
  await API.put(`/admin/business-claims/${id}/reject`, payload)
}

export async function getClaimDocumentDownloadUrl(claimId: string, mediaId: string): Promise<PrivateMediaAccess> {
  const { data } = await API.get<ISuccessResponse<PrivateMediaAccess>>(
    `/admin/business-claims/${claimId}/documents/${mediaId}/download`,
  )
  return data.data
}

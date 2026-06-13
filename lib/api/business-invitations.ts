import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type { BusinessInvitation, CreateInvitePayload, MyInvitation } from "@/types/business-invitations"

export async function createBusinessInvitation(
  businessId: string,
  payload: CreateInvitePayload,
): Promise<BusinessInvitation> {
  const res = await API.post<ISuccessResponse<BusinessInvitation>>(
    `/businesses/${businessId}/memberships/invitations`,
    payload,
  )
  return res.data.data
}

export async function listBusinessInvitations(businessId: string): Promise<BusinessInvitation[]> {
  const res = await API.get<ISuccessResponse<BusinessInvitation[]>>(
    `/businesses/${businessId}/memberships/invitations`,
  )
  return res.data.data
}

export async function revokeBusinessInvitation(businessId: string, invitationId: string): Promise<void> {
  await API.delete(`/businesses/${businessId}/memberships/invitations/${invitationId}`)
}

export async function listMyInvitations(): Promise<MyInvitation[]> {
  const res = await API.get<ISuccessResponse<MyInvitation[]>>("/me/invitations")
  return res.data.data
}

export async function acceptInvitation(id: string): Promise<void> {
  await API.post(`/me/invitations/${id}/accept`)
}

export async function declineInvitation(id: string): Promise<void> {
  await API.post(`/me/invitations/${id}/decline`)
}

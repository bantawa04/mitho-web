import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type { BusinessMembership, UpdateMembershipPayload } from "@/types/business-memberships"

export async function listBusinessMemberships(businessId: string): Promise<BusinessMembership[]> {
  const res = await API.get<ISuccessResponse<BusinessMembership[]>>(`/businesses/${businessId}/memberships`)
  return res.data.data
}

export async function updateBusinessMembership(
  businessId: string,
  membershipId: string,
  payload: UpdateMembershipPayload,
): Promise<BusinessMembership> {
  const res = await API.put<ISuccessResponse<BusinessMembership>>(
    `/businesses/${businessId}/memberships/${membershipId}`,
    payload,
  )
  return res.data.data
}

export async function removeBusinessMembership(businessId: string, membershipId: string): Promise<void> {
  await API.delete(`/businesses/${businessId}/memberships/${membershipId}`)
}

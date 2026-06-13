import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type { DeletionPreflight, DeletionRequest, RequestDeletionPayload } from "@/types/account-deletion"

export async function getDeletionPreflight(): Promise<DeletionPreflight> {
  const res = await API.get<ISuccessResponse<DeletionPreflight>>("/account/deletion/preflight")
  return res.data.data
}

export async function requestAccountDeletion(payload: RequestDeletionPayload): Promise<DeletionRequest> {
  const res = await API.post<ISuccessResponse<DeletionRequest>>("/account/deletion", payload)
  return res.data.data
}

export async function cancelAccountDeletion(): Promise<void> {
  await API.post("/account/deletion/cancel")
}

export async function releaseBusinessOwnership(businessId: string): Promise<void> {
  await API.post(`/businesses/${businessId}/ownership/release`)
}

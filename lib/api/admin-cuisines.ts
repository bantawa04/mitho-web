import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  AdminCuisineItem,
  CreateAdminCuisinePayload,
  UpdateAdminCuisinePayload,
} from "@/types/admin-cuisines"

export async function listAdminCuisines(): Promise<AdminCuisineItem[]> {
  const { data } = await API.get<ISuccessResponse<AdminCuisineItem[]>>("/admin/cuisines")
  return data.data
}

export async function getAdminCuisine(id: string): Promise<AdminCuisineItem> {
  const { data } = await API.get<ISuccessResponse<AdminCuisineItem>>(`/admin/cuisines/${id}`)
  return data.data
}

export async function createAdminCuisine(payload: CreateAdminCuisinePayload): Promise<AdminCuisineItem> {
  const { data } = await API.post<ISuccessResponse<AdminCuisineItem>>("/admin/cuisines", payload)
  return data.data
}

export async function updateAdminCuisine(id: string, payload: UpdateAdminCuisinePayload): Promise<AdminCuisineItem> {
  const { data } = await API.put<ISuccessResponse<AdminCuisineItem>>(`/admin/cuisines/${id}`, payload)
  return data.data
}

export async function deleteAdminCuisine(id: string): Promise<void> {
  await API.delete(`/admin/cuisines/${id}`)
}

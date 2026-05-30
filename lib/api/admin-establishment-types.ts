import API from "@/config/api"
import type {
  AdminEstablishmentTypeItem,
  CreateAdminEstablishmentTypePayload,
  UpdateAdminEstablishmentTypePayload,
} from "@/types/admin-establishment-types"
import type { ISuccessResponse } from "@/types/response"

export async function listAdminEstablishmentTypes(): Promise<AdminEstablishmentTypeItem[]> {
  const { data } = await API.get<ISuccessResponse<AdminEstablishmentTypeItem[]>>("/admin/establishment-types")
  return data.data
}

export async function getAdminEstablishmentType(id: string): Promise<AdminEstablishmentTypeItem> {
  const { data } = await API.get<ISuccessResponse<AdminEstablishmentTypeItem>>(`/admin/establishment-types/${id}`)
  return data.data
}

export async function createAdminEstablishmentType(
  payload: CreateAdminEstablishmentTypePayload,
): Promise<AdminEstablishmentTypeItem> {
  const { data } = await API.post<ISuccessResponse<AdminEstablishmentTypeItem>>("/admin/establishment-types", payload)
  return data.data
}

export async function updateAdminEstablishmentType(
  id: string,
  payload: UpdateAdminEstablishmentTypePayload,
): Promise<AdminEstablishmentTypeItem> {
  const { data } = await API.put<ISuccessResponse<AdminEstablishmentTypeItem>>(`/admin/establishment-types/${id}`, payload)
  return data.data
}

export async function deleteAdminEstablishmentType(id: string): Promise<void> {
  await API.delete(`/admin/establishment-types/${id}`)
}

import API from "@/config/api"
import type { AdminPermission, AdminRole, UpsertRolePayload } from "@/types/admin-roles"
import type { ISuccessResponse } from "@/types/response"

export async function listAdminRoles(): Promise<AdminRole[]> {
  const { data } = await API.get<ISuccessResponse<AdminRole[]>>("/admin/roles")
  return data.data
}

export async function listAdminPermissions(): Promise<AdminPermission[]> {
  const { data } = await API.get<ISuccessResponse<AdminPermission[]>>("/admin/permissions")
  return data.data
}

export async function createAdminRole(payload: UpsertRolePayload): Promise<AdminRole> {
  const { data } = await API.post<ISuccessResponse<AdminRole>>("/admin/roles", payload)
  return data.data
}

export async function updateAdminRole(id: string, payload: UpsertRolePayload): Promise<AdminRole> {
  const { data } = await API.put<ISuccessResponse<AdminRole>>(`/admin/roles/${id}`, payload)
  return data.data
}

export async function deleteAdminRole(id: string): Promise<void> {
  await API.delete(`/admin/roles/${id}`)
}

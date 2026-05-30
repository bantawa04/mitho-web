import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"

export interface AdminPermission {
  id: string
  name: string
  description: string | null
}

export interface AdminRole {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  permissions: AdminPermission[]
}

export interface UpsertRolePayload {
  name: string
  description?: string
  permissionIds: string[]
}

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

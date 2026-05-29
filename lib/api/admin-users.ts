import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"

export interface AdminUserRole {
  id: string
  name: string
  description: string | null
  isSystem: boolean
}

export interface AdminUserItem {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  status: string
  createdAt: string
  updatedAt: string
  roles: AdminUserRole[]
}

export interface AdminUsersMeta {
  page: number
  totalPages: number
  perPage: number
  totalItems: number
}

export interface PaginatedAdminUsers {
  users: AdminUserItem[]
  meta: AdminUsersMeta
}

export interface ListAdminUsersParams {
  page?: number
  per_page?: number
  query?: string
  status?: string
}

export interface InviteAdminUserPayload {
  email: string
  firstName?: string
  lastName?: string
  roleIds: string[]
}

export async function listAdminUsers(params: ListAdminUsersParams = {}): Promise<PaginatedAdminUsers> {
  const { data } = await API.get<ISuccessResponse<PaginatedAdminUsers>>("/admin/users", { params })
  return data.data
}

export async function inviteAdminUser(payload: InviteAdminUserPayload): Promise<AdminUserItem> {
  const { data } = await API.post<ISuccessResponse<AdminUserItem>>("/admin/users", payload)
  return data.data
}

export async function deleteAdminUser(id: string): Promise<void> {
  await API.delete(`/users/${id}`)
}

export async function replaceAdminUserRoles(id: string, roleIds: string[]): Promise<void> {
  await API.put(`/admin/users/${id}/roles`, { roleIds })
}

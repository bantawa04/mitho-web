import API from "@/config/api"
import type {
  AdminUserItem,
  InviteAdminUserPayload,
  ListAdminUsersParams,
  PaginatedAdminUsers,
  UpdateAdminUserPayload,
} from "@/types/admin-users"
import type { ISuccessResponse } from "@/types/response"

export async function listAdminUsers(params: ListAdminUsersParams = {}): Promise<PaginatedAdminUsers> {
  const { data } = await API.get<ISuccessResponse<PaginatedAdminUsers>>("/admin/users", { params })
  return data.data
}

export async function inviteAdminUser(payload: InviteAdminUserPayload): Promise<AdminUserItem> {
  const { data } = await API.post<ISuccessResponse<AdminUserItem>>("/admin/users", payload)
  return data.data
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload): Promise<AdminUserItem> {
  const { data } = await API.put<ISuccessResponse<AdminUserItem>>(`/users/${id}`, payload)
  return data.data
}

export async function deleteAdminUser(id: string): Promise<void> {
  await API.delete(`/users/${id}`)
}

export async function replaceAdminUserRoles(id: string, roleIds: string[]): Promise<void> {
  await API.put(`/admin/users/${id}/roles`, { roleIds })
}

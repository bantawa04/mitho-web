export interface AdminUserRole {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  permissions?: Array<{
    id: string
    name: string
    description: string | null
  }>
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

export interface UpdateAdminUserPayload {
  firstName?: string
  lastName?: string
  email?: string
}

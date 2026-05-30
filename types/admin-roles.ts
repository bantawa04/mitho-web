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

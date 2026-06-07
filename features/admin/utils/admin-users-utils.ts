import { adminPermissionMatrix, type AdminPermissionAction, type AdminPermissionResource } from "@/features/admin/data/admin-data"
import { formatAdminDate } from "@/features/admin/utils/admin-format-utils"
import { getRoleTypePresentation, getUserStatusPresentation } from "@/features/admin/utils/admin-status-utils"
import type { AdminPermission } from "@/types/admin-roles"

export type UserStatusFilter = "All" | "active" | "invited" | "inactive"

export const userStatusOptions: Array<{ value: UserStatusFilter; label: string }> = [
  { value: "All", label: "All" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "inactive", label: "Disabled" },
]

// Maps each matrix cell to the backend permission name it represents.
// null means no matching backend permission exists yet.
export const PERMISSION_MATRIX_MAP: Partial<Record<AdminPermissionResource, Partial<Record<AdminPermissionAction, string | null>>>> = {
  Business: { Create: "businesses.create", Read: "businesses.read", Update: "businesses.update" },
  Reviews: { Read: "reviews.read", Update: "reviews.update", Delete: "reviews.delete" },
  Customer: { Read: "customers.read" },
  Users: { Create: "users.create", Read: "users.read", Update: "users.update", Delete: "users.delete" },
  Roles: { Create: "roles.create", Read: "roles.read", Update: "roles.update", Delete: "roles.delete" },
  Cuisines: { Create: "cuisines.create", Read: "cuisines.read", Update: "cuisines.update", Delete: "cuisines.delete" },
  "Establishment Types": {
    Create: "establishment_types.create",
    Read: "establishment_types.read",
    Update: "establishment_types.update",
    Delete: "establishment_types.delete",
  },
}

export type PermissionMatrix = Record<AdminPermissionResource, Partial<Record<AdminPermissionAction, boolean>>>

export function buildDefaultMatrix(): PermissionMatrix {
  return Object.fromEntries(
    adminPermissionMatrix.map(({ resource }) => [resource, {}]),
  ) as PermissionMatrix
}

export function permissionsToMatrix(rolePermissions: AdminPermission[]): PermissionMatrix {
  const enabledNames = new Set(rolePermissions.map((p) => p.name))
  return Object.fromEntries(
    adminPermissionMatrix.map(({ resource, actions }) => [
      resource,
      Object.fromEntries(
        actions.map((action) => {
          const permName = PERMISSION_MATRIX_MAP[resource]?.[action]
          return [action, permName ? enabledNames.has(permName) : false]
        }),
      ),
    ]),
  ) as PermissionMatrix
}

export function matrixToPermissionIds(matrix: PermissionMatrix, allPermissions: AdminPermission[]): string[] {
  const permByName = new Map(allPermissions.map((p) => [p.name, p.id]))
  const selectedNames = new Set<string>()

  for (const [resource, actions] of Object.entries(matrix)) {
    for (const [action, enabled] of Object.entries(actions ?? {})) {
      if (enabled) {
        const permName = PERMISSION_MATRIX_MAP[resource as AdminPermissionResource]?.[action as AdminPermissionAction]
        if (permName) selectedNames.add(permName)
      }
    }
  }

  return [...selectedNames].map((name) => permByName.get(name)).filter((id): id is string => !!id)
}

export function formatDate(iso: string) {
  return formatAdminDate(iso)
}

export function getUserStatusTone(status: string) {
  return getUserStatusPresentation(status).tone
}

export function getUserStatusLabel(status: string) {
  return getUserStatusPresentation(status).label
}

export function getRoleTypeTone(isSystem: boolean) {
  return getRoleTypePresentation(isSystem).tone
}

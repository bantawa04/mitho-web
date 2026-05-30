import { adminPermissionMatrix, type AdminPermissionAction, type AdminPermissionResource } from "@/features/admin/data/admin-data"
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
  Business: { Create: "businesses.manage", Read: null, Update: "businesses.manage" },
  Customer: { Read: "users.read" },
  Users: { Create: "users.manage", Read: "users.read", Update: "users.manage", Delete: "users.manage" },
  Roles: { Create: "roles.manage", Read: "roles.read", Update: "roles.manage", Delete: "roles.manage" },
  "Establishment Types": { Create: "establishment_types.manage", Read: null, Update: "establishment_types.manage", Delete: "establishment_types.manage" },
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
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function getUserStatusTone(status: string) {
  switch (status) {
    case "invited": return "bg-amber-50 text-amber-700 border-amber-100"
    case "active": return "bg-emerald-50 text-emerald-700 border-emerald-100"
    default: return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

export function getUserStatusLabel(status: string) {
  switch (status) {
    case "invited": return "Invited"
    case "active": return "Active"
    case "inactive": return "Disabled"
    case "banned": return "Banned"
    default: return status
  }
}

export function getRoleTypeTone(isSystem: boolean) {
  return isSystem
    ? "bg-sky-50 text-sky-700 border-sky-100"
    : "bg-brand-soft-beige/80 text-brand-dark-green border-brand-deep-green/10"
}

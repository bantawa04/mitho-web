import type { AuthUser } from "@/types/auth"

const INTERNAL_STAFF_ROLES = new Set(["admin", "super_admin"])

export function isInternalUser(authUser: Pick<AuthUser, "staffRoles"> | null | undefined) {
  return !!authUser?.staffRoles.some((role) => INTERNAL_STAFF_ROLES.has(role))
}

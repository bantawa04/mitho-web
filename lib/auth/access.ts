import type { AuthUser } from "@/types/auth"

export function isInternalUser(authUser: Pick<AuthUser, "staffRoles"> | null | undefined) {
  return (authUser?.staffRoles.length ?? 0) > 0
}

export function isProfileComplete(authUser: Pick<AuthUser, "user"> | null | undefined) {
  return !!authUser?.user.profileComplete
}

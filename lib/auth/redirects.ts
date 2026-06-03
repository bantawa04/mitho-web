import { isInternalUser, isProfileComplete } from "@/lib/auth/access"
import type { AuthUser } from "@/types/auth"

function normalizeRedirect(redirect?: string | null) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) return null
  if (redirect.startsWith("/login")) return null
  return redirect
}

export function buildCompleteProfileHref(redirect?: string | null) {
  const target = normalizeRedirect(redirect)
  if (!target || target === "/complete-profile" || target.startsWith("/complete-profile?")) {
    return "/complete-profile"
  }

  return `/complete-profile?redirect=${encodeURIComponent(target)}`
}

export function getAuthenticatedRedirect(authUser: AuthUser, redirect?: string | null) {
  if (isInternalUser(authUser)) {
    return "/admin"
  }

  const target = normalizeRedirect(redirect)
  if (!isProfileComplete(authUser)) {
    return buildCompleteProfileHref(target)
  }

  if (!target || target === "/complete-profile" || target.startsWith("/complete-profile?")) {
    return "/profile"
  }

  return target
}

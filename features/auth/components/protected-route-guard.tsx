"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { buildCompleteProfileHref } from "@/lib/auth/redirects"

interface ProtectedRouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireCustomer?: boolean
  requireCompleteProfile?: boolean
}

export function ProtectedRouteGuard({
  children,
  requireAdmin = false,
  requireCustomer = false,
  requireCompleteProfile = false,
}: ProtectedRouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { authUser, isHydrated, isAuthenticated, isAdmin } = useAuthSnapshot()

  React.useEffect(() => {
    if (!isHydrated) return

    if (!isAuthenticated) {
      const query = searchParams.toString()
      const redirect = query ? `${pathname}?${query}` : pathname
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }

    if (requireAdmin && !isAdmin) {
      router.replace("/")
      return
    }

    if (requireCustomer && isAdmin) {
      router.replace("/admin")
      return
    }

    if (requireCompleteProfile && !isAdmin && authUser && !authUser.user.profileComplete) {
      const query = searchParams.toString()
      const redirect = query ? `${pathname}?${query}` : pathname
      router.replace(buildCompleteProfileHref(redirect))
    }
  }, [authUser, isAdmin, isAuthenticated, isHydrated, pathname, requireAdmin, requireCompleteProfile, requireCustomer, router, searchParams])

  if (!isHydrated) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (requireAdmin && !isAdmin) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (requireCustomer && isAdmin) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (requireCompleteProfile && !isAdmin && authUser && !authUser.user.profileComplete) {
    return <div className="min-h-screen bg-transparent" />
  }

  return <>{children}</>
}

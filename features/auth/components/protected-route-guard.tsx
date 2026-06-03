"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuthSnapshot } from "@/hooks/use-auth-session"

interface ProtectedRouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireCustomer?: boolean
}

export function ProtectedRouteGuard({
  children,
  requireAdmin = false,
  requireCustomer = false,
}: ProtectedRouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isHydrated, isAuthenticated, isAdmin } = useAuthSnapshot()

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
    }
  }, [isAdmin, isAuthenticated, isHydrated, pathname, requireAdmin, requireCustomer, router, searchParams])

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

  return <>{children}</>
}

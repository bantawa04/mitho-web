"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuthSnapshot } from "@/hooks/use-auth-session"

interface ProtectedRouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRouteGuard({ children, requireAdmin = false }: ProtectedRouteGuardProps) {
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
    }
  }, [isAdmin, isAuthenticated, isHydrated, pathname, requireAdmin, router, searchParams])

  if (!isHydrated) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-transparent" />
  }

  if (requireAdmin && !isAdmin) {
    return <div className="min-h-screen bg-transparent" />
  }

  return <>{children}</>
}

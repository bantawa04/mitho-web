import type { ReactNode } from "react"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"

export default function BusinessProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteGuard requireCompleteProfile>
      <div className="page-shell-business min-h-screen">{children}</div>
    </ProtectedRouteGuard>
  )
}

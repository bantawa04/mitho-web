import type { ReactNode } from "react"
import { AdminShell } from "@/features/admin/components/admin-shell"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteGuard requireAdmin>
      <div className="page-shell-admin min-h-screen">
        <AdminShell>{children}</AdminShell>
      </div>
    </ProtectedRouteGuard>
  )
}

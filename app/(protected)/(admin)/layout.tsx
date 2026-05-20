import type { ReactNode } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell-admin min-h-screen">
      <AdminShell>{children}</AdminShell>
    </div>
  )
}

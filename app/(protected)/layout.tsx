import type { ReactNode } from "react"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedRouteGuard>{children}</ProtectedRouteGuard>
}

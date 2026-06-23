import type { ReactNode } from "react"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"
import { NotificationProvider } from "@/features/notifications/components/notification-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteGuard>
      <NotificationProvider>{children}</NotificationProvider>
    </ProtectedRouteGuard>
  )
}

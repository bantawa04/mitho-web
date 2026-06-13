import type { ReactNode } from "react"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"
import { DeletionPendingBanner } from "@/features/profile/components/deletion-pending-banner"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"

export default function CustomerProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteGuard requireCustomer requireCompleteProfile>
      <div className="page-shell-customer min-h-screen">
        <Header />
        <DeletionPendingBanner />
        <main className="bg-background pb-20">{children}</main>
        <Footer />
      </div>
    </ProtectedRouteGuard>
  )
}

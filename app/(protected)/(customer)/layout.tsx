import type { ReactNode } from "react"
import { ProtectedRouteGuard } from "@/features/auth/components/protected-route-guard"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"

export default function CustomerProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteGuard requireCustomer>
      <div className="page-shell-customer min-h-screen">
        <Header />
        <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">{children}</main>
        <Footer />
      </div>
    </ProtectedRouteGuard>
  )
}

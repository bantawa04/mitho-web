import type { ReactNode } from "react"
import { AuthSessionInitializer } from "@/components/auth/mock-auth-provider"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { currentCustomer } from "@/components/collections/collection-data"

export default function CollectionsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell-customer min-h-screen">
      <AuthSessionInitializer />
      <Header signedInUser={{ name: currentCustomer.name, avatarUrl: currentCustomer.avatarUrl, href: "/profile" }} />
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">{children}</main>
      <Footer />
    </div>
  )
}

import type { ReactNode } from "react"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { mockCustomerProfile } from "@/features/profile/data/profile-data"

export default function CustomerProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header signedInUser={{ name: mockCustomerProfile.name, avatarUrl: mockCustomerProfile.avatarUrl, href: "/profile" }} />
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">{children}</main>
      <Footer />
    </div>
  )
}

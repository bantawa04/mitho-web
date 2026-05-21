import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicUserDiscoveryPage } from "@/features/profile/screens/profile-pages"

export default function PublicUserDiscoveryRoute() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">
        <PublicUserDiscoveryPage />
      </main>
      <Footer />
    </div>
  )
}

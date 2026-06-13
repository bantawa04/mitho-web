import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicUserDiscoveryPage } from "@/features/profile/screens/profile-pages"

export default function PublicUserDiscoveryRoute() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicUserDiscoveryPage />
      </main>
      <Footer />
    </div>
  )
}

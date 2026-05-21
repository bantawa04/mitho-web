import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { AddBusinessFlow } from "@/features/business/screens/add-business-flow"

export default function AddBusinessPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <AddBusinessFlow shell="public" />
        </div>
      </main>

      <Footer />
    </div>
  )
}

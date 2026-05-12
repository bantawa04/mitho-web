import Link from "next/link"
import { CirclePlus, MoveRight } from "lucide-react"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { MithoButton } from "@/components/ui/mitho-button"

export default function AddBusinessPlaceholderPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
        <div className="container mx-auto px-4 py-16">
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-brand-deep-green/10 bg-white px-6 py-10 text-center shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green">
              <CirclePlus className="h-8 w-8" />
            </div>
            <p className="type-eyebrow mt-6 text-brand-deep-green/68">Add business</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-brand-dark-green">
              The full add-business flow is the next workspace we should design.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              This placeholder keeps the new business-management hub from dead-ending while we design the actual listing creation flow.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <MithoButton asChild>
                <Link href="/dashboard/businesses">
                  Back to manage businesses
                  <MoveRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

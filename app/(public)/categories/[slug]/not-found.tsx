import Link from "next/link"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { MithoButton } from "@/components/ui/mitho-button"

export default function CategoryNotFound() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
        <div className="container mx-auto px-4 py-16">
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-brand-deep-green/10 bg-white px-6 py-10 text-center shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <p className="type-eyebrow text-brand-deep-green/68">Category not found</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-brand-dark-green">
              This category guide is not ready yet.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Try heading back to the main category list or open the broader search page to keep browsing local food picks.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <MithoButton asChild>
                <Link href="/#categories">Back to categories</Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/explore">Open broader search</Link>
              </MithoButton>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

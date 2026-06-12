import Link from "next/link"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { MithoButton } from "@/components/mitho/mitho-button"

export default function CategoryNotFound() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-background pb-16">
        <div className="container mx-auto px-4 py-16">
          <section className="mx-auto max-w-3xl rounded-xl border border-border bg-white px-6 py-10 text-center shadow-sm">
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

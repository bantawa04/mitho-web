import Link from "next/link"
import { ArrowRight, Coffee, Compass, MapPin, Search, Soup, UtensilsCrossed } from "lucide-react"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { MithoButton } from "@/components/mitho/mitho-button"

interface NotFoundPageProps {
  eyebrow?: string
  title?: string
  description?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

const quickLinks = [
  { href: "/explore", label: "Explore places", icon: Search },
  { href: "/#categories", label: "Browse categories", icon: Soup },
  { href: "/business/claim", label: "Claim a business", icon: UtensilsCrossed },
]

export function NotFoundPage({
  eyebrow = "404",
  title = "This page wandered off the food map.",
  description = "The link may be old, the page may have moved, or the listing is not ready yet. Start with search and we will get you back to something worth eating.",
  primaryHref = "/explore",
  primaryLabel = "Open broader search",
  secondaryHref = "/",
  secondaryLabel = "Back to home",
}: NotFoundPageProps) {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-soft-beige/55 via-surface-soft to-background">
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            <span className="absolute left-[8%] top-[22%] flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange shadow-sm">
              <Coffee className="h-6 w-6" />
            </span>
            <span className="absolute right-[10%] top-[18%] flex h-16 w-16 rotate-[8deg] items-center justify-center rounded-2xl bg-brand-deep-green/12 text-brand-deep-green shadow-sm">
              <Compass className="h-7 w-7" />
            </span>
            <span className="absolute left-[14%] bottom-[16%] flex h-12 w-12 rotate-[6deg] items-center justify-center rounded-2xl bg-brand-light-green/20 text-brand-deep-green shadow-sm">
              <MapPin className="h-6 w-6" />
            </span>
            <span className="absolute right-[13%] bottom-[18%] flex h-14 w-14 rotate-[-7deg] items-center justify-center rounded-2xl bg-brand-orange/12 text-brand-orange shadow-sm">
              <Soup className="h-6 w-6" />
            </span>
          </div>

          <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex justify-center">
                <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Not found" }]} />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-orange-ink">
                <Compass className="h-3.5 w-3.5" />
                {eyebrow}
              </span>

              <h1 className="type-display mt-5 text-brand-dark-green">
                {title}
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                {description}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <MithoButton asChild size="lg" variant="cta" rightIcon={<ArrowRight />}>
                  <Link href={primaryHref}>{primaryLabel}</Link>
                </MithoButton>
                <MithoButton asChild size="lg" variant="outline-secondary">
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </MithoButton>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="type-section-title text-brand-dark-green">Keep exploring</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              These paths are still open while we look for the missing page.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:border-brand-orange/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-white shadow-sm">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="type-card-title text-brand-dark-green">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Jump back into Mitho Cha without losing your place.
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import Link from "next/link"
import {
  ArrowRight,
  Coffee,
  Croissant,
  Flame,
  Heart,
  IceCreamCone,
  MapPin,
  Soup,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { MithoButton } from "@/components/mitho/mitho-button"

const perks = [
  { icon: Coffee, label: "Momo-fueled days" },
  { icon: MapPin, label: "Nepal-first work" },
  { icon: Users, label: "Small, tight team" },
]

const culture = [
  {
    icon: Flame,
    title: "Move fast, ship real",
    description: "Less process, more shipping. What you build reaches people hunting for their next great meal — fast.",
    cardClass: "border-brand-orange/20 bg-brand-orange/8",
    chipClass: "bg-brand-orange text-white",
  },
  {
    icon: MapPin,
    title: "Built for Nepal",
    description: "Every feature is shaped around Nepal's cities, neighbourhoods, and food. Local impact you can taste.",
    cardClass: "border-brand-deep-green/20 bg-brand-deep-green/8",
    chipClass: "bg-brand-deep-green text-white",
  },
  {
    icon: Heart,
    title: "Real ownership",
    description: "Small team means big surface area. You own real work end to end and see exactly where it lands.",
    cardClass: "border-brand-light-green/30 bg-brand-light-green/12",
    chipClass: "bg-brand-light-green text-white",
  },
]

export function CareersPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        {/* Vibrant editorial hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-soft-beige/55 via-surface-soft to-background">
          {/* Decorative floating food chips */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            <span className="absolute left-[7%] top-[24%] flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange shadow-sm">
              <Coffee className="h-6 w-6" />
            </span>
            <span className="absolute right-[9%] top-[20%] flex h-16 w-16 rotate-[8deg] items-center justify-center rounded-2xl bg-brand-deep-green/12 text-brand-deep-green shadow-sm">
              <Soup className="h-7 w-7" />
            </span>
            <span className="absolute left-[13%] bottom-[16%] flex h-12 w-12 rotate-[6deg] items-center justify-center rounded-2xl bg-brand-light-green/20 text-brand-deep-green shadow-sm">
              <Croissant className="h-6 w-6" />
            </span>
            <span className="absolute right-[12%] bottom-[18%] flex h-14 w-14 rotate-[-7deg] items-center justify-center rounded-2xl bg-brand-orange/12 text-brand-orange shadow-sm">
              <IceCreamCone className="h-6 w-6" />
            </span>
          </div>

          <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex justify-center">
                <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-orange-ink">
                <Sparkles className="h-3.5 w-3.5" />
                Careers at Mitho Cha
              </span>

              <h1 className="type-display mt-5 text-brand-dark-green">
                Come help build Nepal&apos;s tastiest <span className="text-brand-orange">food map</span>.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                We&apos;re a small Nepal-first crew making it easy to find food worth eating. No open roles right
                now — but this is who we are.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                {perks.map((perk) => (
                  <span
                    key={perk.label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium text-brand-dark-green shadow-sm"
                  >
                    <perk.icon className="h-4 w-4 text-brand-orange" />
                    {perk.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Culture — short + colorful */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="type-section-title text-brand-dark-green">What it&apos;s like here</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              A small team that ships, eats well, and builds for Nepal.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {culture.map((item) => (
              <div key={item.title} className={`rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${item.cardClass}`}>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${item.chipClass}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="type-card-title mb-2 text-brand-dark-green">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* No openings — bold dark editorial block */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-surface-strong px-6 py-14 text-center text-surface-strong-foreground md:px-12 md:py-20">
            <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-orange/15 blur-2xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-brand-light-green/10 blur-2xl" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-md">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h2 className="type-section-title text-surface-strong-foreground">The kitchen&apos;s full — for now</h2>
              <p className="mx-auto mt-3 max-w-md leading-7 text-surface-strong-foreground/80">
                No roles open at the moment. The best way to get to know us is to use what we&apos;ve built —
                check back here when we&apos;re hiring again.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <MithoButton asChild size="lg" variant="cta" rightIcon={<ArrowRight />}>
                  <Link href="/explore">Explore Mitho Cha</Link>
                </MithoButton>
                <MithoButton
                  asChild
                  size="lg"
                  variant="outline-secondary"
                  className="border-brand-soft-beige/70 text-brand-soft-beige hover:bg-brand-soft-beige hover:text-brand-dark-green"
                >
                  <Link href="/about">About us</Link>
                </MithoButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

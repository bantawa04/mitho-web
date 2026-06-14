import Link from "next/link"
import { MapPin, Star, MessageSquare, ShieldCheck, Users, Compass } from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { PageHero } from "@/features/static/components/page-hero"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Find places near you",
    description: "Search by city, neighbourhood, or cuisine. Browse restaurants, cafes, dine-in spots, and street food across Nepal.",
  },
  {
    number: "02",
    icon: Star,
    title: "Read honest reviews",
    description: "See what real visitors have to say. Every review comes from someone who actually went there — no paid placements.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Share your experience",
    description: "Found somewhere great? Leave a review and help the next person find it too. That's how the platform stays useful.",
  },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Real visits only",
    description:
      "A review on Mitho Cha comes from someone who actually went. No incentivised ratings, no manufactured praise. What you read is what people genuinely experienced.",
  },
  {
    icon: Users,
    title: "Local knowledge is the best kind",
    description:
      "The most useful guide to food in Lalitpur is someone who eats there every week. We make that neighbourhood-level knowledge findable by everyone.",
  },
  {
    icon: Compass,
    title: "Built for Nepal, not adapted for it",
    description:
      "We're not a global platform that happens to include Nepal. Mitho Cha is built around Nepal's cities, neighbourhoods, and food culture from the ground up.",
  },
]

export function AboutPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <PageHero
          eyebrow="About Mitho Cha"
          title="Built for Nepal's food lovers"
          subtitle="Mitho Cha started from a familiar problem — finding good food in Nepal meant asking around. Great spots stayed hidden. We built the platform we wished existed."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        {/* Story */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="type-section-title mb-6 text-brand-dark-green">Our story</h2>
            <div className="space-y-5 leading-7 text-muted-foreground">
              <p>
                Finding a reliable restaurant used to mean asking a friend who&apos;d been there, a family
                recommendation, or a tip buried in a group chat. That knowledge is real and valuable — but it
                doesn&apos;t travel far, and it doesn&apos;t reach people who are new to a city or just looking
                beyond their usual spots.
              </p>
              <p>
                People exploring a new neighbourhood, visitors to Nepal, or locals wanting to try something
                different had no single, trustworthy place to look. Reviews that did exist were scattered,
                outdated, or written for a different audience entirely.
              </p>
              <p>
                We built Mitho Cha to fix that. A Nepal-first platform where real experiences from real visitors
                help everyone find food they&apos;ll actually enjoy — from the momo stall around the corner to
                places worth a longer journey.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-surface-soft">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="type-section-title mb-2 text-brand-dark-green">How it works</h2>
              <p className="mb-10 leading-7 text-muted-foreground">
                Mitho Cha connects people who are hungry with people who&apos;ve already eaten there.
              </p>
            </div>
            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative rounded-xl border border-border bg-white p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-xs font-bold tracking-widest text-brand-orange/70">{step.number}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10">
                      <step.icon className="h-5 w-5 text-brand-orange" />
                    </div>
                  </div>
                  <h3 className="type-card-title mb-2 text-brand-dark-green">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="type-section-title mb-6 text-brand-dark-green">What we do</h2>
            <div className="space-y-5 leading-7 text-muted-foreground">
              <p>
                Mitho Cha is a food discovery and review platform for Nepal. We help people find
                restaurants, cafes, dine-in spots, and local food — backed by reviews from people who
                actually visited.
              </p>
              <p>
                For businesses, we&apos;re a way to be found by the people already looking for what you offer.
                Listing your business is free. Ownership can be claimed and verified to keep your details,
                photos, and hours accurate.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border bg-surface-soft">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl mb-10">
              <h2 className="type-section-title text-brand-dark-green">What we believe</h2>
            </div>
            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <MithoCard key={value.title}>
                  <MithoCardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-dark-green/8 text-brand-dark-green">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="type-card-title mb-2 text-brand-dark-green">{value.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{value.description}</p>
                  </MithoCardContent>
                </MithoCard>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="type-section-title text-brand-dark-green">Ready to find your next favorite spot?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
              Browse food across Nepal or put your business on the map for the people already looking for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MithoButton asChild size="lg">
                <Link href="/explore">Start exploring</Link>
              </MithoButton>
              <MithoButton asChild size="lg" variant="outline-secondary">
                <Link href="/add-business">Add your business</Link>
              </MithoButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

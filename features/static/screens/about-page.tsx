import Link from "next/link"
import { Compass, HeartHandshake, Sparkles } from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { PageHero } from "@/features/static/components/page-hero"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"

const stats = [
  { value: "2K+", label: "Places listed" },
  { value: "15K+", label: "Local reviews" },
  { value: "75", label: "Cities covered" },
  { value: "98%", label: "Happy foodies" },
]

const values = [
  {
    icon: Compass,
    title: "Discovery first",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  },
  {
    icon: HeartHandshake,
    title: "Community led",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  },
  {
    icon: Sparkles,
    title: "Always honest",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
]

const team = [
  { initials: "AS", name: "Aarav Shrestha", role: "Founder" },
  { initials: "PM", name: "Priya Maharjan", role: "Head of Product" },
  { initials: "RT", name: "Rohan Thapa", role: "Engineering Lead" },
  { initials: "SK", name: "Sneha Karki", role: "Community" },
]

export function AboutPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <PageHero
          eyebrow="About Mitho Cha"
          title="Food worth sharing, picked by people who know"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Our story */}
          <section className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="type-section-title mb-4 text-brand-dark-green">Our story</h2>
              <p className="mb-4 leading-7 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
              <p className="leading-7 text-muted-foreground">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>
            </div>
            <div
              className="aspect-[4/3] w-full rounded-xl border border-border bg-muted"
              aria-label="Image placeholder"
            />
          </section>

          {/* Mission */}
          <section className="mt-16 max-w-3xl">
            <h2 className="type-section-title mb-4 text-brand-dark-green">What we do</h2>
            <p className="leading-7 text-muted-foreground">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
              aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
              explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
          </section>

          {/* Stats strip */}
          <section className="mt-16">
            <div className="grid grid-cols-2 divide-y divide-border rounded-xl border border-border bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="px-6 py-8 text-center">
                  <p className="text-3xl font-bold text-brand-orange">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mt-16">
            <h2 className="type-section-title mb-6 text-brand-dark-green">What we value</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <MithoCard key={value.title}>
                  <MithoCardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h3 className="type-card-title mb-2 text-brand-dark-green">{value.title}</h3>
                    <p className="leading-7 text-muted-foreground">{value.description}</p>
                  </MithoCardContent>
                </MithoCard>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mt-16">
            <h2 className="type-section-title mb-6 text-brand-dark-green">Meet the team</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft-beige text-xl font-bold text-brand-dark-green">
                    {member.initials}
                  </div>
                  <p className="mt-4 font-medium text-brand-dark-green">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Closing CTA */}
        <section className="border-t border-border bg-surface-soft">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="type-section-title text-brand-dark-green">Ready to find your next favorite spot?</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
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

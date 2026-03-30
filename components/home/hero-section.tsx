"use client"

import * as React from "react"
import { Search, MapPin, ChevronDown, Star, UtensilsCrossed, MessageSquareQuote } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoBadge } from "@/components/ui/mitho-badge"

const quickCravings = ["Momos", "Thakali", "Newari", "Cozy cafes"]

const trustPoints = [
  {
    icon: <UtensilsCrossed className="h-5 w-5" />,
    title: "Local-first picks",
    description: "Find neighborhood favorites, not just the biggest names.",
  },
  {
    icon: <MessageSquareQuote className="h-5 w-5" />,
    title: "Honest reviews",
    description: "Read clear notes on taste, portions, service, and vibe.",
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Worth going back for",
    description: "Ratings shaped by food lovers across Nepal.",
  },
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [location, setLocation] = React.useState("Kathmandu")

  return (
    <section className="relative overflow-hidden border-b border-brand-deep-green/10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff8ea_0%,#fffdf8_42%,#fff3d6_100%)]" />
      
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(10,70,53,0.32) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-brand-orange/12 blur-3xl" />
      <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-brand-light-green/12 blur-3xl" />

      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <MithoBadge variant="outline" className="mb-5 border-brand-deep-green/30 bg-white/70">
              Nepal's local food guide
            </MithoBadge>
            <h1 className="type-display motion-soft-rise text-brand-dark-green">
              Find the places people actually
              <span className="text-brand-orange"> love to eat.</span>
            </h1>
            <p className="type-body motion-soft-rise motion-delay-1 mt-6 max-w-xl text-muted-foreground">
              Discover trusted local favorites, hidden gems, and dishes worth leaving home for across Kathmandu,
              Pokhara, Lalitpur, and beyond.
            </p>

            <div className="motion-soft-rise motion-delay-2 mt-8 rounded-[2rem] border border-brand-deep-green/10 bg-white/95 p-4 shadow-[0_24px_60px_rgba(10,70,53,0.12)] backdrop-blur">
              <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search restaurants, dishes, cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 w-full rounded-full border border-brand-deep-green/10 bg-surface-soft pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-orange" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 w-full appearance-none rounded-full border border-brand-deep-green/10 bg-surface-soft pl-12 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <MithoButton size="lg" className="h-14 px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </MithoButton>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="mr-1 font-medium text-brand-dark-green">Popular cravings:</span>
                {quickCravings.map((craving) => (
                  <button
                    key={craving}
                    type="button"
                    className="rounded-full bg-brand-soft-beige/65 px-3 py-1.5 text-brand-dark-green transition-colors hover:bg-brand-orange/15"
                  >
                    {craving}
                  </button>
                ))}
              </div>
            </div>

            <div className="motion-soft-rise motion-delay-3 mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <MithoButton size="lg" leftIcon={<MapPin className="h-5 w-5" />}>
                Start Exploring
              </MithoButton>
              <MithoButton variant="secondary" size="lg">
                List Your Business
              </MithoButton>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div key={point.title} className="surface-raised rounded-[1.5rem] p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green">
                    {point.icon}
                  </div>
                  <p className="text-sm font-semibold text-brand-dark-green">{point.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 top-12 hidden h-40 w-40 rounded-full bg-brand-orange/15 blur-3xl lg:block" />
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[2.25rem] border border-brand-deep-green/10 bg-white p-3 shadow-[0_24px_60px_rgba(10,70,53,0.12)] sm:row-span-2">
                <img
                  src="/nepali-dal-bhat-traditional-meal.jpg"
                  alt="Nepali dal bhat set"
                  className="h-full min-h-[360px] w-full rounded-[1.6rem] object-cover"
                />
                <div className="absolute inset-x-8 bottom-8 rounded-[1.4rem] border border-brand-deep-green/10 bg-white/92 p-4 backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 text-brand-orange">
                    <Star className="h-4 w-4 fill-brand-orange" />
                    <span className="text-sm font-semibold">4.8 average from local reviewers</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rich thalis, well-balanced achar, and service that feels genuinely welcoming.
                  </p>
                </div>
              </div>

              <div className="taste-spotlight rounded-[2rem] border border-brand-orange/10 p-5 shadow-[0_18px_36px_rgba(10,70,53,0.1)]">
                <p className="type-eyebrow text-brand-deep-green/70">
                  This week on Mitho
                </p>
                <p className="mt-3 text-2xl font-bold text-brand-dark-green">2,500+</p>
                <p className="text-sm text-muted-foreground">Local eateries reviewed across growing food neighborhoods.</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-brand-orange">
                  <Star className="h-4 w-4 fill-brand-orange" />
                  <span>50K+ honest reviews and photos</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-1">
                <div className="overflow-hidden rounded-[2rem] border border-brand-deep-green/10 bg-white p-3 shadow-[0_18px_36px_rgba(10,70,53,0.1)]">
                  <img
                    src="/nepali-momos-dumplings-plate.jpg"
                    alt="Steamed momo plate"
                    className="h-40 w-full rounded-[1.35rem] object-cover"
                  />
                  <p className="mt-3 text-sm font-semibold text-brand-dark-green">Best for cravings</p>
                  <p className="text-sm text-muted-foreground">Momos, chowmein, choila, and late-night comfort food.</p>
                </div>
                <div className="overflow-hidden rounded-[2rem] border border-brand-deep-green/10 bg-white p-3 shadow-[0_18px_36px_rgba(10,70,53,0.1)]">
                  <img
                    src="/newari-food-platter.jpg"
                    alt="Newari food platter"
                    className="h-40 w-full rounded-[1.35rem] object-cover"
                  />
                  <p className="mt-3 text-sm font-semibold text-brand-dark-green">Local specials</p>
                  <p className="text-sm text-muted-foreground">Find dishes people recommend by neighborhood, not hype.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

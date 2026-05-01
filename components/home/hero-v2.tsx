"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"

const trustHighlights = ["Moderated local reviews", "Dish-first notes", "Useful owner replies"]

export function HeroV2() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [location, setLocation] = React.useState("Kathmandu")

  return (
    <section className="relative overflow-hidden border-b border-brand-deep-green/10 bg-[linear-gradient(180deg,#fffaf2_0%,#fffef9_46%,#f8efd9_100%)]">
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.88fr)] lg:gap-12">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-brand-deep-green/72">Nepal&apos;s neighborhood food guide</p>
            <h1 className="type-display mt-4 max-w-[11ch] text-brand-dark-green">
              Find the local spots people actually recommend.
            </h1>
            <p className="type-body mt-5 max-w-xl text-muted-foreground">
              Search by dish, neighborhood, or craving and skip generic lists. Mitho is built for the places people in
              Nepal suggest to friends when the meal genuinely matters.
            </p>

            <div className="mt-8 rounded-[1.9rem] border border-brand-deep-green/10 bg-white/84 p-4 shadow-[0_18px_48px_rgba(10,70,53,0.08)] backdrop-blur-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="type-eyebrow text-brand-deep-green/68">Search tonight&apos;s shortlist</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start with one strong clue: the dish, the area, or the kind of place you want.
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-deep-green/48">
                  Local-first recommendations
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                <div className="relative">
                  <label htmlFor="hero-search" className="sr-only">
                    Search for dishes, neighborhoods, or restaurants
                  </label>
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-deep-green/58" />
                  <input
                    id="hero-search"
                    type="text"
                    placeholder="Buff momo, cozy cafes, Patan, thakali..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-[52px] w-full rounded-full border border-brand-deep-green/10 bg-white px-12 pr-4 text-foreground shadow-[0_6px_18px_rgba(10,70,53,0.04)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/12"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="hero-location" className="sr-only">
                    Choose a city
                  </label>
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-orange" />
                  <select
                    id="hero-location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-[52px] w-full appearance-none rounded-full border border-brand-deep-green/10 bg-white pl-12 pr-10 text-foreground shadow-[0_6px_18px_rgba(10,70,53,0.04)] outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/12"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <MithoButton size="lg" className="h-[52px] px-7" asChild>
                  <Link href="#trending">
                    Search
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </MithoButton>
              </div>
            </div>

            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <MithoButton size="lg" asChild>
                <Link href="#trending">Explore local picks</Link>
              </MithoButton>
              <Link
                href="#for-business"
                className="text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
              >
                For restaurant owners
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-deep-green/10 pt-5">
              {trustHighlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-brand-dark-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="surface-raised overflow-hidden rounded-[2rem]">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/nepali-dal-bhat-traditional-meal.jpg"
                alt="Traditional Nepali meal with rice, curry, and side dishes"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.4rem] bg-white/94 p-4 shadow-[0_14px_34px_rgba(10,70,53,0.12)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep-green/60">
                  Most saved this week
                </p>
                <p className="mt-2 text-xl font-semibold leading-tight text-brand-dark-green">
                  Thakali kitchens with dependable achar, balanced spice, and plates worth the trip.
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-brand-deep-green/10 bg-white px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/60">
                  Why this feels useful
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Reviews on Mitho focus on what to order, what the portion feels like, and whether the place is worth
                  the ride across town.
                </p>
              </div>
              <div className="rounded-full bg-brand-dark-green px-4 py-2 text-sm font-medium text-white">
                Real food notes, not filler
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

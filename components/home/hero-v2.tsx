"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, MapPin, Search, Star } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"
import { MithoButton } from "@/components/ui/mitho-button"

const tastingSignals = [
  { label: "Local reviews", value: "50K+" },
  { label: "Neighborhood picks", value: "2,500+" },
  { label: "Cities growing", value: "15+" },
]

const quickSearches = ["Buff momo", "Thakali khana", "Choila", "Late-night chiya"]

export function HeroV2() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [location, setLocation] = React.useState("Kathmandu")

  return (
    <section className="relative overflow-hidden border-b border-brand-deep-green/10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff8ea_0%,#fffdf8_42%,#fff3d6_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(239,138,0,0.12),transparent_40%,rgba(0,121,54,0.08))]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(10,70,53,0.32) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-brand-orange/12 blur-3xl" />
      <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-brand-soft-beige/28 blur-3xl" />

      <div className="relative container mx-auto px-4 py-14 md:py-18 lg:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="motion-soft-rise flex flex-wrap items-center gap-3">
              <span className="capsule-cluster">Kathmandu</span>
              <span className="capsule-cluster">Pokhara</span>
              <span className="capsule-cluster">Lalitpur</span>
            </div>

            <div className="motion-soft-rise motion-delay-1 mt-6 flex items-center gap-4">
              <BrandLogo kind="wordmark" tone="green" className="h-9 w-auto" alt="Mitho Cha! wordmark" priority />
              <div className="h-px flex-1 bg-brand-deep-green/15" />
            </div>

            <p className="type-eyebrow motion-soft-rise motion-delay-1 mt-8 text-brand-deep-green/70">
              Nepal&apos;s neighborhood food guide
            </p>
            <h1 className="type-display motion-soft-rise motion-delay-2 mt-4 max-w-[12ch] text-brand-dark-green">
              The local food guide for bites worth going out for.
            </h1>
            <p className="type-body motion-soft-rise motion-delay-2 mt-6 max-w-xl text-muted-foreground">
              Find the places people genuinely recommend to friends: hidden momo counters, dependable thakali kitchens,
              standout choila, and cafes you&apos;ll actually want to return to.
            </p>

            <div className="motion-soft-rise motion-delay-3 taste-spotlight mt-8 rounded-[2.25rem] border border-brand-orange/15 p-4 shadow-[0_24px_60px_rgba(10,70,53,0.12)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="type-eyebrow text-brand-deep-green/65">Search by dish, mood, or neighborhood</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Less generic browsing, more “what should we actually eat tonight?”
                  </p>
                </div>
                <div className="hidden rounded-full border border-brand-deep-green/10 bg-white/85 px-3 py-1.5 text-xs font-semibold text-brand-dark-green lg:block">
                  Local-first recommendations
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                  <label htmlFor="hero-search" className="sr-only">
                    Search for dishes, neighborhoods, or restaurants
                  </label>
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-deep-green/65" />
                  <input
                    id="hero-search"
                    type="text"
                    placeholder="Search buff momo, cozy cafes, thakali..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-14 w-full rounded-full border border-brand-deep-green/10 bg-white/92 pl-12 pr-4 text-foreground shadow-[0_8px_24px_rgba(10,70,53,0.05)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/12"
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
                    className="h-14 w-full appearance-none rounded-full border border-brand-deep-green/10 bg-white/92 pl-12 pr-10 text-foreground shadow-[0_8px_24px_rgba(10,70,53,0.05)] outline-none transition-[border-color,box-shadow] duration-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/12"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <MithoButton size="lg" className="h-14 px-8" asChild>
                  <Link href="#trending">
                    Search
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </MithoButton>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {quickSearches.map((item) => (
                  <Link
                    key={item}
                    href="#trending"
                    className="rounded-full border border-brand-deep-green/10 bg-white/85 px-3 py-1.5 text-sm font-medium text-brand-dark-green transition-colors hover:border-brand-orange/25 hover:bg-brand-soft-beige"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="motion-soft-rise motion-delay-3 mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <MithoButton size="lg" asChild>
                <Link href="#trending">
                  <MapPin className="h-5 w-5" />
                  Explore now
                </Link>
              </MithoButton>
              <MithoButton variant="link" size="lg" asChild>
                <Link href="#for-business">For restaurant owners</Link>
              </MithoButton>
            </div>

            <div className="motion-soft-rise motion-delay-3 mt-8 grid grid-cols-3 gap-3">
              {tastingSignals.map((item) => (
                <div key={item.label} className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white/80 p-4 shadow-[0_10px_24px_rgba(10,70,53,0.06)]">
                  <p className="type-eyebrow text-brand-deep-green/55">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-brand-dark-green">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="motion-soft-rise motion-delay-2 relative min-h-[540px] lg:min-h-[620px]">
            <div className="absolute right-0 top-0 h-[74%] w-[72%] overflow-hidden rounded-[2.5rem] border border-brand-deep-green/10 bg-white p-3 shadow-[0_24px_70px_rgba(10,70,53,0.16)]">
              <Image
                src="/nepali-dal-bhat-traditional-meal.jpg"
                alt="Nepali meal"
                fill
                sizes="(min-width: 1024px) 32vw, 72vw"
                className="rounded-[2rem] object-cover"
              />
              <div className="absolute inset-x-8 bottom-8 rounded-[1.5rem] bg-white/92 p-4 backdrop-blur-md">
                <p className="type-eyebrow text-brand-deep-green/60">Tonight&apos;s most saved</p>
                <p className="mt-2 text-xl font-bold text-brand-dark-green">Thakali kitchens with strong achar, generous plates, and zero hype.</p>
              </div>
            </div>

            <div className="absolute left-0 top-10 w-[48%] rotate-[-3deg] rounded-[2rem] border border-brand-deep-green/12 bg-white p-3 shadow-[0_18px_44px_rgba(10,70,53,0.12)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/nepali-momos-dumplings-plate.jpg"
                  alt="Steamed momo plate"
                  fill
                  sizes="(min-width: 1024px) 18vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <p className="type-card-title text-brand-dark-green">Buff jhol momo</p>
                  <p className="type-meta text-xs">New Road crowd favorite</p>
                </div>
                <div className="capsule-cluster px-2.5 py-1">
                  <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                  4.8
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-[14%] w-[44%] rounded-[1.75rem] border border-brand-deep-green/10 bg-brand-dark-green p-5 text-white shadow-[0_18px_44px_rgba(10,70,53,0.16)]">
              <p className="type-eyebrow text-brand-soft-beige/70">What people loved</p>
              <p className="mt-3 text-lg font-semibold leading-snug">
                “The choila came out smoky, spicy, and exactly the kind of thing you text your friends about.”
              </p>
              <p className="mt-4 text-sm text-white/72">Rajan Shrestha on Newari Bhoj</p>
            </div>

            <div className="absolute bottom-[8%] right-[6%] rounded-full border border-brand-orange/20 bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(239,138,0,0.26)]">
              Fresh spots this week
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

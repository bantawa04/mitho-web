"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"

const quickChips = [
  { label: "Momo", href: "/explore?category=restaurants&q=momo" },
  { label: "Cafes", href: "/explore?category=cafes" },
  { label: "Thakali", href: "/explore?q=thakali" },
  { label: "Open now", href: "/explore?openNow=true" },
]

export function HeroV2() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/explore?q=${encodeURIComponent(trimmedQuery)}`)
    } else {
      router.push("/explore")
    }
  }

  return (
    <section className="relative min-h-[55dvh] max-h-[640px] flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/thakali.jpg"
          alt="Thakali meal"
          fill
          priority
          className="object-cover"
        />
        {/* Simple black overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <p className="type-eyebrow text-brand-soft-beige/90 drop-shadow-md">Nepal&apos;s neighborhood food guide</p>
        <h1 className="type-display mt-4 max-w-[15ch] text-white drop-shadow-lg">
          Find the local spots people actually recommend.
        </h1>

        <form
          onSubmit={handleSearchSubmit}
          className="mt-12 w-full max-w-2xl relative flex items-center group shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search for dishes or restaurants
          </label>
          <div className="absolute left-5 text-brand-deep-green/60">
            <Search className="h-5 w-5" />
          </div>
          <input
            id="hero-search"
            type="text"
            placeholder="Search for buff momo, cozy cafes, thakali..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-14 w-full rounded-xl bg-white pl-14 pr-[64px] text-base text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
          />
          <MithoButton
            type="submit"
            className="absolute right-2 h-10 px-4"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </MithoButton>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {quickChips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-brand-dark-green hover:bg-white transition-colors"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


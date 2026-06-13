"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"

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
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center">
        <p className="type-eyebrow text-brand-soft-beige/90 drop-shadow-md">Nepal&apos;s neighborhood food guide</p>
        <h1 className="type-display mt-4 max-w-[15ch] text-white drop-shadow-lg">
          Find the local spots people actually recommend.
        </h1>

        <form
          onSubmit={handleSearchSubmit}
          className="mt-12 w-full max-w-2xl relative flex items-center group"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search for dishes or restaurants
          </label>
          <div className="absolute left-6 text-brand-deep-green/50">
            <Search className="h-5 w-5" />
          </div>
          <input
            id="hero-search"
            type="text"
            placeholder="Search for buff momo, cozy cafes, thakali..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-[64px] w-full rounded-full border border-border bg-white pl-14 pr-[76px] text-base text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <MithoButton
            type="submit"
            className="absolute right-2 h-[48px] w-[48px] p-0 rounded-full flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </MithoButton>
        </form>
      </div>
    </section>
  )
}


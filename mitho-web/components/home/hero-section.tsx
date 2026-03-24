"use client"

import * as React from "react"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [location, setLocation] = React.useState("Kathmandu")

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-soft-beige via-white to-brand-soft-beige/50" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23EF8A00' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark-green mb-6 text-balance leading-tight">
          Discover the Real <span className="text-brand-orange">Taste of Nepal</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
          Find authentic restaurants, food trucks, and hidden local gems reviewed by locals.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-2xl shadow-lg border border-border">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search restaurants, dishes, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-brand-soft-beige/30 border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              />
            </div>

            {/* Location Selector */}
            <div className="relative sm:w-48">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-orange" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 pl-12 pr-10 rounded-xl bg-brand-soft-beige/30 border-0 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              >
                <option value="Kathmandu">Kathmandu</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Search Button */}
            <MithoButton size="lg" className="h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </MithoButton>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MithoButton size="lg" leftIcon={<MapPin className="h-5 w-5" />}>
            Find Eateries Near Me
          </MithoButton>
          <MithoButton variant="link" size="lg">
            List Your Business
          </MithoButton>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-brand-orange">2,500+</p>
            <p className="text-sm text-muted-foreground">Local Eateries</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-brand-deep-green">50K+</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-brand-orange">15+</p>
            <p className="text-sm text-muted-foreground">Cities</p>
          </div>
        </div>
      </div>
    </section>
  )
}

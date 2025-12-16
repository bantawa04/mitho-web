"use client"

import * as React from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { MithoBreadcrumb } from "@/components/ui/mitho-breadcrumb"
import { BusinessHero } from "@/components/business/business-hero"
import { QuickActions } from "@/components/business/quick-actions"
import { GallerySection } from "@/components/business/gallery-section"
import { InfoPanel } from "@/components/business/info-panel"
import { MenuHighlights } from "@/components/business/menu-highlights"
import { RatingsSection } from "@/components/business/ratings-section"
import { ReviewsSection } from "@/components/business/reviews-section"
import { AddReviewForm } from "@/components/business/add-review-form"
import { SimilarPlaces } from "@/components/business/similar-places"
import { SponsoredSection } from "@/components/business/sponsored-section"
import { ClaimReport } from "@/components/business/claim-report"

const businessData = {
  name: "Himalayan Flavors",
  coverImage: "/placeholder.svg?height=600&width=1200",
  rating: 4.3,
  reviewCount: 294,
  categories: ["Restaurant", "Nepali", "Tibetan"],
  location: "Thamel, Kathmandu",
  isOpen: true,
}

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Kathmandu", href: "/city/kathmandu" },
  { label: "Restaurants", href: "/city/kathmandu/restaurants" },
  { label: "Himalayan Flavors" },
]

export default function BusinessDetailPage() {
  const [isSaved, setIsSaved] = React.useState(false)
  const [sortOrder, setSortOrder] = React.useState("all")

  const scrollToReview = () => {
    document.getElementById("add-review")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-12">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <MithoBreadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <BusinessHero {...businessData} isSaved={isSaved} onSave={() => setIsSaved(!isSaved)} />

        {/* Quick Actions */}
        <QuickActions isSaved={isSaved} onSave={() => setIsSaved(!isSaved)} onWriteReview={scrollToReview} />

        {/* Gallery */}
        <GallerySection />

        {/* Info Panel */}
        <InfoPanel />

        {/* Menu Highlights */}
        <MenuHighlights />

        {/* Ratings Summary with Sort Dropdown */}
        <RatingsSection sortOrder={sortOrder} onSortChange={setSortOrder} />

        {/* Customer Reviews with Pagination */}
        <ReviewsSection sortOrder={sortOrder} />

        {/* Add Review Form */}
        <AddReviewForm />

        {/* Similar Places */}
        <SimilarPlaces />

        {/* Sponsored Section */}
        <SponsoredSection />

        {/* Claim/Report */}
        <ClaimReport />
      </main>

      <Footer />
    </div>
  )
}

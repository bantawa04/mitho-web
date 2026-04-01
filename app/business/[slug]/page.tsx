"use client"

import * as React from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { MithoBreadcrumb } from "@/components/ui/mitho-breadcrumb"
import { BusinessHero } from "@/components/business/business-hero"
import { InfoPanel } from "@/components/business/info-panel"
import { MenuHighlights } from "@/components/business/menu-highlights"
import { RatingsSection } from "@/components/business/ratings-section"
import { ReviewsSection } from "@/components/business/reviews-section"
import { AddReviewForm } from "@/components/business/add-review-form"
import { SimilarPlaces } from "@/components/business/similar-places"
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

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const shareUrl = window.location.href

    if (navigator.share) {
      await navigator.share({
        title: businessData.name,
        text: `Check out ${businessData.name} on Mitho Cha.`,
        url: shareUrl,
      })
      return
    }

    await navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="pb-16">
        <div className="container mx-auto px-4 py-4">
          <MithoBreadcrumb items={breadcrumbItems} />
        </div>

        <BusinessHero
          {...businessData}
          isSaved={isSaved}
          onSave={() => setIsSaved(!isSaved)}
          onWriteReview={scrollToReview}
          onShare={handleShare}
        />

        <div className="mt-10 border-y border-brand-deep-green/10 bg-gradient-to-b from-white via-brand-soft-beige/12 to-white">
          <InfoPanel />
          <MenuHighlights />
        </div>

        <div className="bg-surface-soft/60">
          <RatingsSection sortOrder={sortOrder} onSortChange={setSortOrder} />
          <ReviewsSection sortOrder={sortOrder} />
          <AddReviewForm />
        </div>

        <div className="bg-white">
          <SimilarPlaces />
          <ClaimReport />
        </div>
      </main>

      <Footer />
    </div>
  )
}

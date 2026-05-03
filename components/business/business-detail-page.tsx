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
import type { BusinessPageData } from "@/components/business/business-detail-types"

interface BusinessDetailPageProps {
  pageData: BusinessPageData
}

export function BusinessDetailPage({ pageData }: BusinessDetailPageProps) {
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
        title: pageData.name,
        text: `Check out ${pageData.name} on Mitho Cha.`,
        url: shareUrl,
      })
      return
    }

    await navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fff9ee_36%,#ffffff_64%,#fffdf9_100%)] pb-20">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <MithoBreadcrumb items={pageData.breadcrumbItems} />
        </div>

        <BusinessHero
          name={pageData.name}
          coverImage={pageData.coverImage}
          rating={pageData.rating}
          reviewCount={pageData.reviewCount}
          categories={pageData.categories}
          location={pageData.location}
          isOpen={pageData.isOpen}
          heroNote={pageData.heroNote}
          isSaved={isSaved}
          onSave={() => setIsSaved(!isSaved)}
          onWriteReview={scrollToReview}
          onShare={handleShare}
        />

        <div className="mt-10">
          <InfoPanel
            galleryItems={pageData.galleryItems}
            galleryTotalCount={pageData.galleryTotalCount}
            galleryEmptyMessage={pageData.galleryEmptyMessage}
            visitInfo={pageData.visitInfo}
          />
          <MenuHighlights
            items={pageData.menuItems}
            emptyMessage={pageData.menuEmptyMessage}
            menuLink={pageData.menuLink}
          />
        </div>

        <div className="mt-4">
          <RatingsSection ratingsData={pageData.ratingsData ?? null} />
          <ReviewsSection
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            reviews={pageData.reviews}
            emptyMessage={pageData.reviewsEmptyMessage}
          />
          <AddReviewForm isFirstReview={pageData.reviews.length === 0} prompt={pageData.addReviewPrompt} />
        </div>

        <div className="mt-2 bg-transparent">
          <SimilarPlaces />
          <ClaimReport />
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import * as React from "react"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { MithoButton } from "@/components/mitho/mitho-button"
import { AddToCollectionDialog } from "@/features/collections/components/add-to-collection-dialog"
import {
  buildCollectionItemFromCandidate,
  createCollectionId,
  currentCustomer,
  ownedCollections,
  type CollectionCandidate,
  type CollectionRecord,
} from "@/features/collections/data/collection-data"
import { toast } from "@/hooks/use-toast"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { BusinessHero } from "@/features/business/components/business-hero"
import { InfoPanel } from "@/features/business/components/info-panel"
import { MenuHighlights } from "@/features/business/components/menu-highlights"
import { RatingsSection } from "@/features/business/components/ratings-section"
import { ReviewsSection } from "@/features/business/components/reviews-section"
import { AddReviewForm } from "@/features/business/components/add-review-form"
import { SimilarPlaces } from "@/features/business/components/similar-places"
import { ClaimReport } from "@/features/business/components/claim-report"
import type { BusinessPageData } from "@/features/business/business-detail-types"
import { isBusinessEarlyListing } from "@/features/business/business-detail-utils"

interface BusinessDetailPageProps {
  pageData: BusinessPageData
  claimHref?: string
  publicHref: string
}

export function BusinessDetailPage({ pageData, claimHref = "/business/claim", publicHref }: BusinessDetailPageProps) {
  const [sortOrder, setSortOrder] = React.useState("all")
  const { isAuthenticated } = useAuthSnapshot()
  const [collections, setCollections] = React.useState<CollectionRecord[]>(ownedCollections)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = React.useState(false)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [reopenCollectionDialogAfterAuth, setReopenCollectionDialogAfterAuth] = React.useState(false)
  const isEarlyListing = isBusinessEarlyListing(pageData)

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

  const collectionCandidate = React.useMemo<CollectionCandidate>(() => {
    const previewImage =
      pageData.coverImage ??
      pageData.galleryItems.find((item) => item.type === "image")?.src ??
      "/placeholder.svg?height=600&width=1200"

    return {
      id: createCollectionId(pageData.name),
      businessName: pageData.name,
      location: pageData.location,
      category: pageData.categories.slice(0, 2).join(" · ") || "Place",
      note: pageData.heroNote,
      imageUrl: previewImage,
      publicHref,
    }
  }, [pageData.categories, pageData.coverImage, pageData.galleryItems, pageData.heroNote, pageData.location, pageData.name, publicHref])

  const handleAddToCollectionPress = () => {
    if (!isAuthenticated) {
      setReopenCollectionDialogAfterAuth(true)
      setIsSignInOpen(true)
      return
    }

    setIsCollectionDialogOpen(true)
  }

  const handleAddToExistingCollection = (collectionId: string) => {
    let addedCollectionTitle = ""

    setCollections((current) =>
      current.map((collection) => {
        if (collection.id !== collectionId) return collection

        addedCollectionTitle = collection.title

        return {
          ...collection,
          items: [...collection.items, buildCollectionItemFromCandidate(collectionCandidate)],
          updatedLabel: "Updated just now",
        }
      }),
    )

    setIsCollectionDialogOpen(false)
    toast({
      title: "Collection updated",
      description: `Added ${pageData.name} to ${addedCollectionTitle}.`,
    })
  }

  const handleCreateCollectionAndAdd = (values: { title: string; description?: string; visibility: "private" | "public" }) => {
    const newCollectionTitle = values.title
    const newCollection: CollectionRecord = {
      id: createCollectionId(values.title),
      title: values.title,
      description: values.description,
      visibility: values.visibility,
      updatedLabel: "Created just now",
      owner: currentCustomer,
      items: [buildCollectionItemFromCandidate(collectionCandidate)],
    }

    setCollections((current) => [newCollection, ...current])
    setIsCollectionDialogOpen(false)
    toast({
      title: "Collection created",
      description: `Created ${newCollectionTitle} and added ${pageData.name}.`,
    })
  }

  React.useEffect(() => {
    if (!isAuthenticated || !reopenCollectionDialogAfterAuth) return

    setIsCollectionDialogOpen(true)
    setReopenCollectionDialogAfterAuth(false)
  }, [isAuthenticated, reopenCollectionDialogAfterAuth])

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fffaf3_30%,#ffffff_68%,#fffdf9_100%)] pb-20">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <MithoBreadcrumb items={pageData.breadcrumbItems} />
        </div>

        <BusinessHero
          name={pageData.name}
          sourceBadge={pageData.sourceBadge}
          isEarlyListing={isEarlyListing}
          coverImage={pageData.coverImage}
          rating={pageData.rating}
          reviewCount={pageData.reviewCount}
          categories={pageData.categories}
          location={pageData.location}
          isOpen={pageData.isOpen}
          heroNote={pageData.heroNote}
          onAddToCollection={handleAddToCollectionPress}
          onWriteReview={scrollToReview}
          onShare={handleShare}
        />

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 border-b border-brand-deep-green/10 bg-[#fffdf8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fffdf8]/80">
          <div className="container mx-auto px-4">
            <nav className="flex gap-6 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <a href="#overview" className="border-b-2 border-brand-orange py-4 text-sm font-semibold text-brand-dark-green transition-colors">Overview</a>
              <a href="#menu" className="border-b-2 border-transparent py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-dark-green">Menu</a>
              <a href="#reviews" className="border-b-2 border-transparent py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-dark-green">Reviews</a>
            </nav>
          </div>
        </div>

        <div className="mt-8" id="overview">
          <InfoPanel
            isEarlyListing={isEarlyListing}
            galleryItems={pageData.galleryItems}
            galleryTotalCount={pageData.galleryTotalCount}
            galleryEmptyMessage={pageData.galleryEmptyMessage}
            visitInfo={pageData.visitInfo}
          />
          <div id="menu">
            <MenuHighlights
              isEarlyListing={isEarlyListing}
              items={pageData.menuItems}
              emptyMessage={pageData.menuEmptyMessage}
              menuLink={pageData.menuLink}
            />
          </div>
        </div>

        <div className="mt-4" id="reviews">
          <RatingsSection isEarlyListing={isEarlyListing} ratingsData={pageData.ratingsData ?? null} />
          <ReviewsSection
            isEarlyListing={isEarlyListing}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            reviews={pageData.reviews}
            emptyMessage={pageData.reviewsEmptyMessage}
          />
          <AddReviewForm
            isEarlyListing={isEarlyListing}
            isFirstReview={pageData.reviews.length === 0}
            prompt={pageData.addReviewPrompt}
          />
        </div>

        <div className="mt-4 bg-transparent">
          <SimilarPlaces subdued={isEarlyListing} />
          <ClaimReport subdued={isEarlyListing} claimHref={claimHref} />
        </div>
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-deep-green/10 bg-white p-4 pb-safe shadow-[0_-8px_24px_rgba(10,70,53,0.05)] md:hidden">
        <div className="flex gap-3 max-w-md mx-auto">
          <MithoButton size="lg" className="flex-1 justify-center shadow-sm" onClick={scrollToReview}>
            Write Review
          </MithoButton>
          <MithoButton size="lg" variant="outline-secondary" className="flex-1 justify-center bg-white shadow-sm" onClick={handleAddToCollectionPress}>
            Add to collection
          </MithoButton>
        </div>
      </div>

      <Footer />

      <AddToCollectionDialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        candidate={collectionCandidate}
        collections={collections}
        onAddToCollection={handleAddToExistingCollection}
        onCreateCollection={handleCreateCollectionAndAdd}
      />

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        title="Sign in to add this place to your collections."
        description="Use Google so Mitho can keep your collections, reviews, and future business actions under the same account."
        helperCopy="Once sign-in is connected for real, this same flow will bring you back to the collection picker without losing the business you were trying to save."
        onContinue={() => {
          setIsSignInOpen(false)
        }}
      />
    </div>
  )
}

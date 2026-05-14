"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { GoogleSignInDialog } from "@/components/auth/google-sign-in-dialog"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog"
import {
  buildCollectionItemFromCandidate,
  createCollectionId,
  currentCustomer,
  ownedCollections,
  type CollectionCandidate,
  type CollectionRecord,
} from "@/components/collections/collection-data"
import { MithoBreadcrumb } from "@/components/ui/mitho-breadcrumb"
import { MithoBadge } from "@/components/ui/mitho-badge"
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
  claimHref?: string
  publicHref: string
}

export function BusinessDetailPage({ pageData, claimHref = "/business/claim", publicHref }: BusinessDetailPageProps) {
  const [sortOrder, setSortOrder] = React.useState("all")
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [collections, setCollections] = React.useState<CollectionRecord[]>(ownedCollections)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = React.useState(false)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [reopenCollectionDialogAfterAuth, setReopenCollectionDialogAfterAuth] = React.useState(false)
  const [lastAddedMessage, setLastAddedMessage] = React.useState<string | null>(null)
  const isEarlyListing =
    pageData.sourceBadge === "mitho" &&
    !pageData.coverImage &&
    !pageData.ratingsData &&
    pageData.reviews.length === 0 &&
    pageData.galleryItems.length === 0 &&
    pageData.menuItems.length === 0

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
    setLastAddedMessage(null)

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
    setLastAddedMessage(`Added to ${addedCollectionTitle}.`)
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

    setCollections((current) => [current[0], newCollection, ...current.slice(1)])
    setLastAddedMessage(`Created ${newCollectionTitle} and added this place.`)
  }

  React.useEffect(() => {
    if (!isAuthenticated || !reopenCollectionDialogAfterAuth) return

    setIsCollectionDialogOpen(true)
    setReopenCollectionDialogAfterAuth(false)
  }, [isAuthenticated, reopenCollectionDialogAfterAuth])

  return (
    <div className="page-shell-customer min-h-screen">
      <Header signedInUser={isAuthenticated ? { name: currentCustomer.name, avatarUrl: currentCustomer.avatarUrl, href: "/profile" } : undefined} />

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

        {lastAddedMessage ? (
          <div className="container mx-auto mt-5 px-4">
            <div className="flex flex-wrap items-center gap-3 rounded-[1.35rem] border border-success/18 bg-success/8 px-5 py-4 text-sm text-brand-dark-green">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <MithoBadge variant="success">Collection updated</MithoBadge>
              <p className="font-medium">{lastAddedMessage}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-10">
          <InfoPanel
            isEarlyListing={isEarlyListing}
            galleryItems={pageData.galleryItems}
            galleryTotalCount={pageData.galleryTotalCount}
            galleryEmptyMessage={pageData.galleryEmptyMessage}
            visitInfo={pageData.visitInfo}
          />
          <MenuHighlights
            isEarlyListing={isEarlyListing}
            items={pageData.menuItems}
            emptyMessage={pageData.menuEmptyMessage}
            menuLink={pageData.menuLink}
          />
        </div>

        <div className="mt-4">
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
          setIsAuthenticated(true)
          setIsSignInOpen(false)
        }}
      />
    </div>
  )
}

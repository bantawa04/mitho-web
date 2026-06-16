"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { addCollectionItem } from "@/lib/api/collections"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useCollectionPicker, useCreateCollection } from "@/hooks/use-collections"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useBusinessReviews, useBusinessTips } from "@/hooks/use-reviews"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { MithoButton } from "@/components/mitho/mitho-button"
import { AddToCollectionDialog } from "@/features/collections/components/add-to-collection-dialog"
import { createCollectionId } from "@/features/collections/utils/collection-helpers"
import { toast } from "@/hooks/use-toast"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { BusinessHero } from "@/features/business/components/business-hero"
import { InfoPanel } from "@/features/business/components/info-panel"
import { RatingsSection } from "@/features/business/components/ratings-section"
import { ReviewsSection } from "@/features/business/components/reviews-section"
import { TipsSection } from "@/features/business/components/tips-section"
import { AddReviewForm } from "@/features/business/components/add-review-form"
import { AddReviewModal } from "@/features/business/components/add-review-modal"
import { SimilarPlaces } from "@/features/business/components/similar-places"
import { ClaimReport } from "@/features/business/components/claim-report"
import type { BusinessPageData } from "@/features/business/business-detail-types"
import { isBusinessEarlyListing } from "@/features/business/business-detail-utils"
import { mapReviewItemToBusinessReview, mapReviewSummaryToRatingsData } from "@/features/business/mappers/public-business-page-data"
import type { CollectionCandidate } from "@/types/collections"
import { getBusinessReviewShareTitle } from "@/lib/seo"

interface BusinessDetailPageProps {
  pageData: BusinessPageData
  claimHref?: string
  publicHref: string
}

export function BusinessDetailPage({ pageData, claimHref = "/business/claim", publicHref }: BusinessDetailPageProps) {
  const [sortOrder, setSortOrder] = React.useState<"latest" | "oldest" | "highest" | "lowest">("latest")
  const [reviewPage, setReviewPage] = React.useState(1)
  const [tipsPage, setTipsPage] = React.useState(1)
  const { isAuthenticated } = useAuthSnapshot()
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = React.useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false)
  const [signInIntent, setSignInIntent] = React.useState<"collection" | "review" | null>(null)
  const [reopenCollectionDialogAfterAuth, setReopenCollectionDialogAfterAuth] = React.useState(false)
  const [collectionSearchQuery, setCollectionSearchQuery] = React.useState("")
  const debouncedCollectionSearchQuery = useDebouncedValue(collectionSearchQuery, 250)
  const shouldLoadCollections = isAuthenticated && isCollectionDialogOpen
  const collectionsQuery = useCollectionPicker(
    {
      businessId: pageData.id,
      search: debouncedCollectionSearchQuery,
      sort: "recent",
    },
    { enabled: shouldLoadCollections, perPage: 20 },
  )
  const createCollectionMutation = useCreateCollection()
  const addCollectionItemMutation = useMutation({
    mutationFn: ({ collectionId, businessId, note }: { collectionId: string; businessId: string; note?: string }) =>
      addCollectionItem(collectionId, { businessId, note }),
  })
  const isEarlyListing = isBusinessEarlyListing(pageData)
  const reviewsQuery = useBusinessReviews(pageData.id, {
    page: reviewPage,
    perPage: 5,
    sort: sortOrder,
  })
  const tipsQuery = useBusinessTips(pageData.id, {
    page: tipsPage,
    perPage: 5,
    sort: "latest",
  })
  const reviewCards = React.useMemo(
    () => reviewsQuery.data?.items.map(mapReviewItemToBusinessReview) ?? pageData.reviews,
    [pageData.reviews, reviewsQuery.data?.items],
  )
  const ratingsData = React.useMemo(
    () => mapReviewSummaryToRatingsData(reviewsQuery.data?.summary) ?? pageData.ratingsData ?? null,
    [pageData.ratingsData, reviewsQuery.data?.summary],
  )
  const infoPanelGalleryItems = React.useMemo(() => {
    if (!pageData.coverImage) return pageData.galleryItems
    return pageData.galleryItems.filter((item) => item.src !== pageData.coverImage)
  }, [pageData.coverImage, pageData.galleryItems])

  React.useEffect(() => {
    setReviewPage(1)
  }, [sortOrder])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    const timeout = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100)
    return () => clearTimeout(timeout)
  }, [])

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const shareUrl = window.location.href

    if (navigator.share) {
      await navigator.share({
        title: getBusinessReviewShareTitle(pageData.name),
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
      "/brand/logo-primary-green.svg"

    return {
      id: createCollectionId(pageData.name),
      businessName: pageData.name,
      location: pageData.location,
      category:
        pageData.categories
          .slice(0, 2)
          .map((category) => category.label)
          .join(" · ") || "Place",
      note: pageData.heroNote,
      imageUrl: previewImage,
      publicHref,
      businessId: pageData.id,
    }
  }, [pageData.categories, pageData.coverImage, pageData.galleryItems, pageData.heroNote, pageData.location, pageData.name, publicHref])

  const handleAddToCollectionPress = () => {
    if (!isAuthenticated) {
      setReopenCollectionDialogAfterAuth(true)
      setSignInIntent("collection")
      return
    }

    setIsCollectionDialogOpen(true)
  }

  const handleAddToExistingCollection = (collectionId: string) => {
    const collections = collectionsQuery.data?.pages.flatMap((page) => page.items) ?? []
    const addedCollectionTitle = collections.find((item) => item.id === collectionId)?.title ?? "collection"
    addCollectionItemMutation.mutate(
      {
        collectionId,
        businessId: collectionCandidate.businessId,
        note: collectionCandidate.note,
      },
      {
        onSuccess: () => {
          setIsCollectionDialogOpen(false)
          collectionsQuery.refetch()
          toast({
            title: "Collection updated",
            description: `Added ${pageData.name} to ${addedCollectionTitle}.`,
          })
        },
      },
    )
  }

  const handleCreateCollectionAndAdd = (values: { title: string; description?: string; visibility: "private" | "public" }) => {
    createCollectionMutation.mutate(
      {
        ...values,
        initialItem: {
          businessId: collectionCandidate.businessId,
          note: collectionCandidate.note,
        },
      },
      {
        onSuccess: () => {
          setIsCollectionDialogOpen(false)
          collectionsQuery.refetch()
          toast({
            title: "Collection created",
            description: `Created ${values.title} and added ${pageData.name}.`,
          })
        },
      },
    )
  }

  React.useEffect(() => {
    if (!isAuthenticated || !reopenCollectionDialogAfterAuth) return

    setIsCollectionDialogOpen(true)
    setReopenCollectionDialogAfterAuth(false)
  }, [isAuthenticated, reopenCollectionDialogAfterAuth])

  const collectionPickerItems = React.useMemo(
    () => collectionsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [collectionsQuery.data?.pages],
  )

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <MithoBreadcrumb items={pageData.breadcrumbItems} />
        </div>

        <BusinessHero
          name={pageData.name}
          sourceBadge={pageData.sourceBadge}
          isEarlyListing={isEarlyListing}
          coverImage={pageData.coverImage}
          rating={ratingsData?.averageRating ?? pageData.rating}
          reviewCount={reviewsQuery.data?.summary.totalReviews ?? pageData.reviewCount}
          categories={pageData.categories}
          location={pageData.location}
          isOpen={pageData.isOpen}
          heroNote={pageData.heroNote}
          onAddToCollection={handleAddToCollectionPress}
          onWriteReview={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setIsReviewModalOpen(true)
            } else {
              scrollToSection("add-review")
            }
          }}
          onShare={handleShare}
        />

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 border-b border-border bg-background">
          <div className="container mx-auto px-4">
            <nav className="flex gap-6 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <a href="#overview" onClick={(e) => { e.preventDefault(); scrollToSection("overview") }} className="border-b-2 border-primary py-4 text-sm font-semibold text-brand-dark-green transition-colors">Overview</a>
              <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection("reviews") }} className="border-b-2 border-transparent py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-dark-green">Reviews</a>
              <a href="#tips" onClick={(e) => { e.preventDefault(); scrollToSection("tips") }} className="border-b-2 border-transparent py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-dark-green">Tips</a>
            </nav>
          </div>
        </div>

        <div className="mt-8" id="overview">
          <InfoPanel
            isEarlyListing={isEarlyListing}
            galleryItems={infoPanelGalleryItems}
            galleryTotalCount={infoPanelGalleryItems.length}
            galleryEmptyMessage={pageData.galleryEmptyMessage}
            visitInfo={pageData.visitInfo}
          />
        </div>

        <div className="mt-4" id="reviews">
          <RatingsSection isEarlyListing={isEarlyListing} ratingsData={ratingsData} />
          <ReviewsSection
            isEarlyListing={isEarlyListing}
            sortOrder={sortOrder}
            onSortChange={(value) => setSortOrder(value as "latest" | "oldest" | "highest" | "lowest")}
            reviews={reviewCards}
            emptyMessage={pageData.reviewsEmptyMessage}
            currentPage={reviewsQuery.data?.meta.page ?? reviewPage}
            totalPages={reviewsQuery.data?.meta.totalPages ?? 1}
            onPageChange={setReviewPage}
            isLoading={reviewsQuery.isLoading}
          />
          <div className="hidden lg:block">
            <AddReviewForm
              businessId={pageData.id}
              businessName={pageData.name}
              isEarlyListing={isEarlyListing}
              isFirstReview={(reviewsQuery.data?.summary.totalReviews ?? pageData.reviews.length) === 0}
              prompt={pageData.addReviewPrompt}
              onRequireAuth={() => setSignInIntent("review")}
            />
          </div>
          <div id="tips">
            <TipsSection
              tips={tipsQuery.data?.items ?? []}
              currentPage={tipsQuery.data?.meta.page ?? tipsPage}
              totalPages={tipsQuery.data?.meta.totalPages ?? 1}
              onPageChange={setTipsPage}
              isLoading={tipsQuery.isLoading}
            />
          </div>
        </div>

        <div className="mt-4 bg-transparent">
          <SimilarPlaces
            subdued={isEarlyListing}
            businessId={pageData.id}
            coordinates={pageData.visitInfo.coordinates}
          />
          <ClaimReport subdued={isEarlyListing} claimHref={claimHref} />
        </div>
      </main>

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2 lg:hidden">
        <MithoButton size="lg" className="flex-1 justify-center" onClick={() => setIsReviewModalOpen(true)}>
          Write a review
        </MithoButton>
        <MithoButton size="lg" variant="outline-secondary" className="flex-1 justify-center" onClick={handleAddToCollectionPress}>
          Save
        </MithoButton>
      </div>

      <Footer />

      <AddReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        businessId={pageData.id}
        businessName={pageData.name}
        isEarlyListing={isEarlyListing}
        isFirstReview={(reviewsQuery.data?.summary.totalReviews ?? pageData.reviews.length) === 0}
        prompt={pageData.addReviewPrompt}
        onRequireAuth={() => setSignInIntent("review")}
      />

      <AddToCollectionDialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        candidate={collectionCandidate}
        collections={collectionPickerItems}
        searchQuery={collectionSearchQuery}
        isLoadingCollections={collectionsQuery.isLoading}
        isLoadingMoreCollections={collectionsQuery.isFetchingNextPage}
        hasMoreCollections={collectionsQuery.hasNextPage}
        onSearchQueryChange={setCollectionSearchQuery}
        onLoadMoreCollections={() => {
          collectionsQuery.fetchNextPage()
        }}
        onAddToCollection={handleAddToExistingCollection}
        onCreateCollection={handleCreateCollectionAndAdd}
      />

      <GoogleSignInDialog
        open={signInIntent !== null}
        onOpenChange={(open) => {
          if (!open) setSignInIntent(null)
        }}
        title={
          signInIntent === "review"
            ? "Sign in to post your review."
            : "Sign in to add this place to your collections."
        }
        description={
          signInIntent === "review"
            ? "Use Google so Mitho can connect your review, collections, and future business actions to the same account."
            : "Use Google so Mitho can keep your collections, reviews, and future business actions under the same account."
        }
        helperCopy={
          signInIntent === "review"
            ? "Your rating and review draft will be restored when you come back. If the page reloads during sign-in, you may need to reselect any images."
            : "Once sign-in is connected for real, this same flow will bring you back to the collection picker without losing the business you were trying to save."
        }
        stayOnCurrentPageAfterSignIn={signInIntent === "collection"}
        onContinue={() => {
          setSignInIntent(null)
        }}
      />
    </div>
  )
}

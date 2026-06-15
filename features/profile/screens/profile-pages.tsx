"use client"

import Link from "next/link"
import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bookmark, Building2, Camera, ChevronRight, Clock3, Copy, Globe, Lock, Mail, MapPin, Search, Settings, Star, Trash2, UserCheck, UserPlus, Users } from "lucide-react"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { useAuthSnapshot, useUpdateProfile } from "@/hooks/use-auth-session"
import { useCollections, usePublicCollections } from "@/hooks/use-collections"
import { useMyReviews } from "@/hooks/use-reviews"
import { useUploadMedia } from "@/hooks/use-media"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import type { UpdateProfilePayload } from "@/lib/api/auth"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import type { ReviewItem, ReviewStatus } from "@/types/reviews"
import { getCollectionCoverImages, getCollectionPlaceCount } from "@/features/collections/utils/collection-helpers"
import { CollectionShowcaseCard } from "@/features/collections/components/collection-showcase-card"
import type { PublicUserProfileData } from "@/features/profile/data/profile-data"
import { useDeletionPreflight, useReleaseBusinessOwnership, useRequestAccountDeletion } from "@/hooks/use-account-deletion"
import type { DeletionBlocker } from "@/types/account-deletion"
import type { PublicCreatorItem } from "@/lib/api/profile"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  useFollowers,
  useFollowUser,
  useMyFollowing,
  usePublicCreatorDirectory,
  usePublicProfile,
  useUnfollowUser,
  useUserFollowing,
} from "@/hooks/use-profile"
import { CreatorFollowCard } from "@/features/profile/components/creator-follow-card"
import { ProfileNavigation } from "@/features/profile/components/profile-navigation"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const sectionCardClass =
  "rounded-xl border border-brand-deep-green/10 bg-white shadow-sm"
const PUBLIC_COLLECTION_PAGE_SIZE = 12
const PUBLIC_COLLECTION_SEARCH_THRESHOLD = 6
const PUBLIC_CREATOR_DIRECTORY_PER_PAGE = 12

function ProfileTabsPanel() {
  return (
    <section className={sectionCardClass}>
      <div className="px-4 py-4 sm:px-6">
        <ProfileNavigation />
      </div>
    </section>
  )
}

function BusinessBanner() {
  const { hasBusinessAccess, isHydrated, authUser } = useAuthSnapshot()
  const membershipCount = authUser?.businessMemberships.filter((m) => m.status === "active").length ?? 0

  if (!isHydrated || !hasBusinessAccess) return null
  if (membershipCount === 0) return null

  return (
    <div className="border-t border-brand-deep-green/10 px-6 py-5 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-deep-green/10 text-brand-deep-green">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MithoBadge variant="success">Business access live</MithoBadge>
            <MithoBadge variant="muted">{membershipCount} workspace</MithoBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <MithoButton variant="outline-secondary" size="sm" asChild>
            <Link href="/dashboard/businesses">
              Manage businesses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </MithoButton>
          <MithoButton variant="ghost" size="sm" asChild>
            <Link href="/business/claim">Claim another</Link>
          </MithoButton>
        </div>
      </div>
    </div>
  )
}

export function ProfileHubPage() {
  const { authUser } = useAuthSnapshot()
  const currentUsername = authUser?.user.username ?? ""
  const collectionsQuery = useCollections({ perPage: 3 })
  const recentReviewsQuery = useMyReviews({ perPage: 3 })
  const publicProfileQuery = usePublicProfile(currentUsername)
  const recentReviews = recentReviewsQuery.data?.items ?? []
  const previewCollections = collectionsQuery.data?.items ?? []
  const collectionCount = collectionsQuery.data?.meta.total ?? 0
  const stats = [
    {
      label: "Reviews written",
      value: recentReviewsQuery.data?.meta.total ?? 0,
      icon: Star,
      accent: "text-brand-orange",
      bg: "bg-brand-orange/10",
      href: "/profile/reviews",
    },
    {
      label: "Collections",
      value: collectionCount,
      icon: Bookmark,
      accent: "text-brand-deep-green",
      bg: "bg-brand-deep-green/10",
      href: "/collections",
    },
    {
      label: "Followers",
      value: publicProfileQuery.data?.followerCount ?? 0,
      icon: Users,
      accent: "text-brand-dark-green",
      bg: "bg-brand-dark-green/10",
      href: "/profile/followers",
    },
    {
      label: "Following",
      value: publicProfileQuery.data?.followingCount ?? 0,
      icon: UserPlus,
      accent: "text-brand-orange",
      bg: "bg-brand-orange/10",
      href: "/profile/following",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <section className={sectionCardClass}>
        {/* Navigation */}
        <div className="px-6 py-4 sm:px-8">
          <ProfileNavigation />
        </div>

        {/* Profile header */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {publicProfileQuery.data?.avatarUrl ? (
                <img
                  src={publicProfileQuery.data.avatarUrl}
                  alt={publicProfileQuery.data.name}
                  className="h-16 w-16 rounded-full border-4 border-brand-soft-beige object-cover sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-soft-beige bg-brand-deep-green/10 text-xl font-semibold text-brand-deep-green sm:h-20 sm:w-20">
                  {publicProfileQuery.data?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <h1 className="type-page-title text-brand-dark-green">{publicProfileQuery.data?.name ?? ""}</h1>
                <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  {publicProfileQuery.data?.joinedLabel ?? ""}
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{publicProfileQuery.data?.bio ?? ""}</p>
              </div>
            </div>
            <MithoButton variant="outline-secondary" className="shrink-0 self-start" asChild>
              <Link href="/profile/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </MithoButton>
          </div>
        </div>

        {/* Stats row */}
        <div className="border-t border-brand-deep-green/10">
          <div className="grid grid-cols-2 divide-x divide-y divide-brand-deep-green/10 sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="flex items-center gap-3 px-6 py-5 transition-colors duration-200 hover:bg-muted sm:px-8"
              >
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.accent}`} />
                </span>
                <div>
                  <p className={`text-2xl font-bold leading-none ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Business banner */}
        <BusinessBanner />

        {/* Recent reviews */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-dark-green">Recent reviews</h2>
            <MithoButton variant="ghost" size="sm" asChild>
              <Link href="/profile/reviews">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </MithoButton>
          </div>
          <div className="mt-4 divide-y divide-brand-deep-green/10">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => {
                const href = reviewBusinessHref(review)
                const badge = reviewStatusBadge[review.status]
                return (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {href ? (
                            <Link href={href} className="text-base font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
                              {review.businessName || "Business"}
                            </Link>
                          ) : (
                            <span className="text-base font-semibold text-brand-dark-green">{review.businessName || "Business"}</span>
                          )}
                          <MithoBadge variant={badge.variant}>{badge.label}</MithoBadge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                            {review.rating.toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatReviewDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.title ? <p className="mt-2 max-w-3xl text-sm font-semibold text-brand-dark-green">{review.title}</p> : null}
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{review.body}</p>
                    {review.reply ? (
                      <div className="mt-3 max-w-3xl rounded-lg border border-brand-deep-green/10 bg-[#fffdf8] p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-brand-deep-green">Response from Owner</span>
                          <span className="text-xs text-muted-foreground">{formatReplyDate(review.reply.updatedAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-foreground">{review.reply.body}</p>
                      </div>
                    ) : null}
                  </div>
                )
              })
            ) : (
              <p className="py-4 text-sm leading-7 text-muted-foreground">
                {recentReviewsQuery.isLoading ? "Loading your reviews…" : "No reviews yet — your local notes will show up here."}
              </p>
            )}
          </div>
        </div>

        {/* Collections */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-dark-green">Collections</h2>
            <MithoButton variant="ghost" size="sm" asChild>
              <Link href="/collections">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </MithoButton>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {previewCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group rounded-xl border border-brand-deep-green/10 bg-muted p-4 transition-colors duration-200 hover:border-brand-deep-green/18"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-base font-semibold text-brand-dark-green">{collection.title}</h3>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {collection.visibility === "public" ? (
                      <MithoBadge variant="neutral" className="gap-1">
                        <Globe className="h-3 w-3" />
                        Public
                      </MithoBadge>
                    ) : (
                      <MithoBadge variant="muted" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </MithoBadge>
                    )}
                    {collection.provenance ? <MithoBadge variant="outline-orange" className="gap-1"><Copy className="h-3 w-3" />Copied</MithoBadge> : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {getCollectionCoverImages(collection).slice(0, 3).map((imageUrl, index) => (
                    <img key={`${collection.id}-${index}`} src={imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  ))}
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  {getCollectionPlaceCount(collection)} places
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const reviewStatusBadge: Record<ReviewStatus, { variant: "warning" | "success" | "danger"; label: string }> = {
  pending: { variant: "warning", label: "Pending moderation" },
  approved: { variant: "success", label: "Published" },
  rejected: { variant: "danger", label: "Needs changes" },
}

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function formatReplyDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function reviewBusinessHref(review: ReviewItem) {
  return review.publicHref?.trim() || null
}

export function ProfileReviewsPage() {
  const [page, setPage] = React.useState(1)
  const reviewsQuery = useMyReviews({ page, perPage: 10 })
  const reviews = reviewsQuery.data?.items ?? []
  const meta = reviewsQuery.data?.meta

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <section className={sectionCardClass}>
        {/* Navigation */}
        <div className="px-6 py-4 sm:px-8">
          <ProfileNavigation />
        </div>

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-deep-green/10 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold text-brand-dark-green">My Reviews</h1>
          <MithoBadge variant="neutral">{meta?.total ?? 0} reviews</MithoBadge>
        </div>

        {/* Review list */}
        <div className="border-t border-brand-deep-green/10 px-6 sm:px-8">
          {reviewsQuery.isLoading ? (
            <div className="space-y-4 py-5">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-xl border border-brand-deep-green/10 bg-muted" />
              ))}
            </div>
          ) : reviewsQuery.isError ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-7 text-muted-foreground">Could not load your reviews right now. Please try again shortly.</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="divide-y divide-brand-deep-green/10">
              {reviews.map((review) => {
                const href = reviewBusinessHref(review)
                const badge = reviewStatusBadge[review.status]
                return (
                  <div key={review.id} className="py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {href ? (
                            <Link href={href} className="text-lg font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
                              {review.businessName || "Business"}
                            </Link>
                          ) : (
                            <span className="text-lg font-semibold text-brand-dark-green">{review.businessName || "Business"}</span>
                          )}
                          <MithoBadge variant={badge.variant}>{badge.label}</MithoBadge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                            {review.rating.toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4" />
                            {formatReviewDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      {href ? (
                        <MithoButton variant="ghost" size="sm" asChild>
                          <Link href={href}>View business</Link>
                        </MithoButton>
                      ) : null}
                    </div>
                    {review.title ? <p className="mt-3 max-w-3xl text-sm font-semibold text-brand-dark-green">{review.title}</p> : null}
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{review.body}</p>
                    {review.reply ? (
                      <div className="mt-3 max-w-3xl rounded-lg border border-brand-deep-green/10 bg-[#fffdf8] p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-brand-deep-green">Response from Owner</span>
                          <span className="text-xs text-muted-foreground">{formatReplyDate(review.reply.updatedAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-foreground">{review.reply.body}</p>
                      </div>
                    ) : null}
                    {review.status === "rejected" ? (
                      <div className="mt-3 max-w-3xl rounded-lg border border-danger/15 bg-danger/5 p-3 text-sm text-danger">
                        {review.moderationNote ? <p>{review.moderationNote}</p> : <p>This review was not approved.</p>}
                        {href ? (
                          <Link href={`${href}#add-review`} className="mt-1 inline-block font-semibold underline-offset-2 hover:underline">
                            Fix and resubmit
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10">
                <Star className="h-6 w-6 text-brand-orange" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-brand-dark-green">No reviews yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Start sharing your local food notes to help others discover places worth trying.
              </p>
            </div>
          )}

          {meta && meta.totalPages > 1 ? (
            <div className="border-t border-brand-deep-green/10 py-5">
              <MithoPagination currentPage={page} totalPages={Number(meta.totalPages)} onPageChange={setPage} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function BlockerBusinessCard({
  business,
  onResolved,
}: {
  business: DeletionBlocker["businesses"][number]
  onResolved: () => void
}) {
  const release = useReleaseBusinessOwnership(business.businessId)
  const { toast } = useToast()
  const [isReleaseOpen, setIsReleaseOpen] = React.useState(false)

  const handleRelease = () => {
    release.mutate(undefined, {
      onSuccess: () => {
        setIsReleaseOpen(false)
        toast({ title: "Business released", description: `${business.businessName} is now unclaimed.` })
        onResolved()
      },
      onError: (error) => {
        toast({ title: "Could not release", description: extractApiErrorMessage(error), variant: "destructive" })
      },
    })
  }

  return (
    <div className="rounded-lg border border-brand-deep-green/10 bg-muted p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-deep-green/10">
          <Building2 className="h-4 w-4 text-brand-deep-green" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-dark-green">{business.businessName}</p>
          <p className="mt-1 text-xs text-muted-foreground">You are the sole owner. Transfer or release before deletion.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {business.resolutions.includes("transfer") ? (
              <MithoButton variant="outline-secondary" size="sm" asChild>
                <Link href={`/dashboard/businesses/${business.businessId}/team`}>Transfer ownership</Link>
              </MithoButton>
            ) : null}
            {business.resolutions.includes("release") ? (
              <>
                <MithoButton variant="outline-danger" size="sm" onClick={() => setIsReleaseOpen(true)}>
                  Release to unclaimed
                </MithoButton>
                <AlertDialog open={isReleaseOpen} onOpenChange={setIsReleaseOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Release {business.businessName}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes you and all team members from the business. It becomes unclaimed and can be reclaimed by a new owner in the future.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-danger text-danger-foreground hover:bg-danger/90"
                        onClick={handleRelease}
                      >
                        {release.isPending ? "Releasing…" : "Release business"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileSettingsPage() {
  const router = useRouter()
  const { authUser } = useAuthSnapshot()
  const updateProfile = useUpdateProfile()
  const uploadMedia = useUploadMedia()
  const { toast } = useToast()
  const sessionUser = authUser?.user
  const initialForm = React.useMemo(
    () => ({
      firstName: sessionUser?.firstName ?? "",
      lastName: sessionUser?.lastName ?? "",
      avatarUrl: sessionUser?.avatarUrl ?? "",
      bio: sessionUser?.bio ?? "",
      phone: sessionUser?.phone ?? "",
      address: sessionUser?.address ?? "",
    }),
    [sessionUser],
  )
  const [form, setForm] = React.useState(initialForm)
  const [isDeleteFlowOpen, setIsDeleteFlowOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const preflightQuery = useDeletionPreflight(isDeleteFlowOpen)
  const requestDeletion = useRequestAccountDeletion()

  React.useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim() || sessionUser?.email || "Profile photo"

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    try {
      const media = await uploadMedia.mutateAsync({
        file,
        title: "Profile photo",
        altText: displayName,
      })
      updateForm("avatarUrl", media.publicUrl)
    } catch (error) {
      toast({
        title: "Could not upload image",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    const payload: UpdateProfilePayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: form.address,
      bio: form.bio,
      avatarUrl: form.avatarUrl,
    }

    updateProfile.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Profile updated",
          description: "Your profile details have been saved.",
        })
      },
      onError: (error) => {
        toast({
          title: "Could not save changes",
          description: extractApiErrorMessage(error),
          variant: "destructive",
        })
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <ProfileTabsPanel />

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <p className="type-eyebrow text-brand-deep-green/68">Profile details</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Edit the basics people connect to your account.</h2>
          </div>
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)] sm:px-8">
            <div className="space-y-4">
              <div className="rounded-xl border border-brand-deep-green/10 bg-muted p-5">
                <div className="mx-auto w-fit rounded-full border border-brand-deep-green/10 bg-white p-2 shadow-sm">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt={displayName} className="h-28 w-28 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-deep-green/10 text-3xl font-semibold text-brand-deep-green">
                      {displayName ? displayName[0]?.toUpperCase() : "?"}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="mt-4 space-y-3 flex flex-col items-center">
                  <MithoButton
                    type="button"
                    variant="outline-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Camera className="h-4 w-4" />}
                    loading={uploadMedia.isPending}
                    disabled={uploadMedia.isPending}
                  >
                    {uploadMedia.isPending ? "Uploading..." : "Upload image"}
                  </MithoButton>
                  <p className="text-xs leading-6 text-muted-foreground">Use a clear square photo that still looks good at small sizes.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">First name</span>
                  <Input
                    value={form.firstName}
                    onChange={(event) => updateForm("firstName", event.target.value)}
                    className="h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Last name</span>
                  <Input
                    value={form.lastName}
                    onChange={(event) => updateForm("lastName", event.target.value)}
                    className="h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Short bio</span>
                <Textarea
                  value={form.bio}
                  onChange={(event) => updateForm("bio", event.target.value)}
                  rows={5}
                  className="rounded-lg border-brand-deep-green/12 bg-muted px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Mobile number</span>
                  <Input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Address</span>
                  <Input
                    value={form.address}
                    onChange={(event) => updateForm("address", event.target.value)}
                    className="h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-brand-deep-green/10 pt-5 sm:flex-row sm:items-center sm:justify-end">
                <MithoButton
                  variant="outline-secondary"
                  onClick={() => setForm(initialForm)}
                  disabled={updateProfile.isPending}
                >
                  Discard changes
                </MithoButton>
                <MithoButton onClick={handleSave} loading={updateProfile.isPending} disabled={updateProfile.isPending}>
                  Save changes
                </MithoButton>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <p className="type-eyebrow text-brand-deep-green/68">Account credentials</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Locked details tied to sign-in and account identity.</h2>
          </div>
          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 sm:px-8">
            <div className="rounded-xl border border-brand-deep-green/10 bg-muted p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green">
                <Mail className="h-4 w-4 text-brand-orange" />
                Account email
              </div>
              <Input value={sessionUser?.email ?? ""} disabled className="mt-4 h-12 rounded-lg border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Your email comes from Google sign-in. It&apos;s how you log in and recover your account, so it can&apos;t be changed here.</p>
            </div>

            <div className="rounded-xl border border-brand-deep-green/10 bg-muted p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green">
                <Lock className="h-4 w-4 text-brand-orange" />
                Username
              </div>
              <Input value={sessionUser?.username ? `@${sessionUser.username}` : ""} disabled className="mt-4 h-12 rounded-lg border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Your @username is your public profile link and how others mention you. It&apos;s locked so your existing links and reviews keep working.</p>
            </div>
          </div>
        </section>

        <section className={`${sectionCardClass} border-danger/18`}>
          <div className="border-b border-danger/12 px-6 py-6 sm:px-8">
            <p className="type-eyebrow text-danger/75">Account lifecycle</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Delete your account deliberately.</h2>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="rounded-xl border border-danger/15 bg-danger/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-brand-dark-green">Delete account</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Use this when you want Mitho to remove your account under a GDPR-style self-serve flow. Approved reviews stay anonymized. You have 30 days to cancel by signing back in.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <MithoButton variant="outline-danger" onClick={() => setIsDeleteFlowOpen(true)}>
                  Delete account
                </MithoButton>
              </div>
            </div>
          </div>
        </section>

        <Dialog open={isDeleteFlowOpen} onOpenChange={setIsDeleteFlowOpen}>
          <DialogContent className="sm:max-w-xl">
            {preflightQuery.isLoading ? (
              <>
                <DialogHeader>
                  <DialogTitle>Checking account status…</DialogTitle>
                  <DialogDescription>Please wait while we verify your account can be deleted.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-deep-green border-t-transparent" />
                </div>
              </>
            ) : preflightQuery.isError ? (
              <>
                <DialogHeader>
                  <DialogTitle>Could not check deletion status</DialogTitle>
                  <DialogDescription>Something went wrong. Please try again.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <MithoButton variant="outline-secondary" onClick={() => setIsDeleteFlowOpen(false)}>Close</MithoButton>
                  <MithoButton onClick={() => preflightQuery.refetch()}>Retry</MithoButton>
                </DialogFooter>
              </>
            ) : preflightQuery.data && !preflightQuery.data.allowed ? (
              <>
                <DialogHeader>
                  <DialogTitle>Resolve business responsibilities first</DialogTitle>
                  <DialogDescription>
                    You are the sole owner of {preflightQuery.data.blockers.reduce((n, b) => n + b.businesses.length, 0)} business workspace. Transfer or release it before deleting your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {preflightQuery.data.blockers.flatMap((blocker) =>
                    blocker.businesses.map((biz) => (
                      <BlockerBusinessCard key={biz.businessId} business={biz} onResolved={() => preflightQuery.refetch()} />
                    )),
                  )}
                </div>
                <DialogFooter>
                  <MithoButton variant="outline-secondary" onClick={() => setIsDeleteFlowOpen(false)}>Cancel</MithoButton>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Delete this Mitho account?</DialogTitle>
                  <DialogDescription>
                    Your account will be hidden immediately and permanently deleted after a 30-day grace window. Approved reviews stay anonymized. You can cancel by signing back in within 30 days.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <MithoButton variant="outline-secondary" onClick={() => setIsDeleteFlowOpen(false)} disabled={requestDeletion.isPending}>
                    Keep account
                  </MithoButton>
                  <MithoButton
                    variant="outline-danger"
                    loading={requestDeletion.isPending}
                    disabled={requestDeletion.isPending}
                    onClick={() => {
                      requestDeletion.mutate({}, {
                        onSuccess: () => {
                          setIsDeleteFlowOpen(false)
                          router.push("/")
                          toast({ title: "Deletion scheduled", description: "Your account will be deleted in 30 days. Sign back in to cancel." })
                        },
                        onError: (error) => {
                          toast({ title: "Could not schedule deletion", description: extractApiErrorMessage(error), variant: "destructive" })
                        },
                      })
                    }}
                  >
                    Schedule deletion
                  </MithoButton>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function FollowingListCard({ profile }: { profile: PublicCreatorItem }) {
  const unfollow = useUnfollowUser(profile.username)

  return (
    <div className="rounded-xl border border-brand-deep-green/10 bg-muted p-5 transition-colors duration-200 hover:border-brand-deep-green/18">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/users/${profile.username}`} className="flex min-w-0 items-start gap-3">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-12 w-12 rounded-full border-2 border-brand-soft-beige object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-soft-beige bg-brand-deep-green/10 text-base font-semibold text-brand-deep-green">
              {profile.name ? profile.name[0].toUpperCase() : "?"}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-brand-dark-green">{profile.name}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/58">
              @{profile.username}
            </p>
          </div>
        </Link>
        <MithoButton
          type="button"
          variant="outline-secondary"
          size="sm"
          disabled={unfollow.isPending}
          onClick={() => unfollow.mutate()}
        >
          <UserCheck className="h-4 w-4" />
          Following
        </MithoButton>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MithoBadge variant="muted">{profile.followerCount} followers</MithoBadge>
        <MithoBadge variant="neutral">{profile.collectionCount} collections</MithoBadge>
        <MithoBadge variant="muted">{profile.reviewCount} reviews</MithoBadge>
      </div>
    </div>
  )
}

export function ProfileFollowingPage() {
  const followingQuery = useMyFollowing()
  const followingProfiles = followingQuery.data?.items ?? []

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <section className={sectionCardClass}>
        {/* Navigation */}
        <div className="px-6 py-4 sm:px-8">
          <ProfileNavigation />
        </div>

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-deep-green/10 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold text-brand-dark-green">Following</h1>
          <MithoBadge variant="neutral">{followingQuery.data?.meta.totalItems ?? followingProfiles.length} following</MithoBadge>
        </div>

        {/* Following list */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          {followingQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-xl border border-brand-deep-green/10 bg-muted" />
              ))}
            </div>
          ) : followingQuery.isError ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-7 text-muted-foreground">Could not load your following list right now. Please try again shortly.</p>
            </div>
          ) : followingProfiles.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {followingProfiles.map((profile) => (
                  <FollowingListCard key={profile.userId} profile={profile} />
                ))}
              </div>

              {/* Discover more */}
              <div className="flex items-center justify-center border-t border-brand-deep-green/10 pt-5">
                <MithoButton variant="outline-secondary" asChild>
                  <Link href="/users">
                    Discover more creators
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </MithoButton>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep-green/10">
                <Users className="h-6 w-6 text-brand-deep-green" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-brand-dark-green">Not following anyone yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Follow public creators whose collections and reviews feel worth revisiting, and they will appear here.
              </p>
              <div className="mt-5">
                <MithoButton variant="outline-secondary" asChild>
                  <Link href="/users">Browse creators</Link>
                </MithoButton>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function ProfileFollowersPage() {
  const { authUser } = useAuthSnapshot()
  const currentUsername = authUser?.user.username ?? ""
  const followersQuery = useFollowers(currentUsername)
  const followers = followersQuery.data?.items ?? []

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <section className={sectionCardClass}>
        {/* Navigation */}
        <div className="px-6 py-4 sm:px-8">
          <ProfileNavigation />
        </div>

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-deep-green/10 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold text-brand-dark-green">Followers</h1>
          <MithoBadge variant="neutral">{followersQuery.data?.meta.totalItems ?? followers.length} followers</MithoBadge>
        </div>

        {/* Followers list */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          {followersQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-40 animate-pulse rounded-xl border border-brand-deep-green/10 bg-muted" />
              ))}
            </div>
          ) : followersQuery.isError ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-7 text-muted-foreground">Could not load your followers right now. Please try again shortly.</p>
            </div>
          ) : followers.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {followers.map((profile) => (
                  <CreatorFollowCard key={profile.userId} item={profile} />
                ))}
              </div>

              {/* Discover more */}
              <div className="flex items-center justify-center border-t border-brand-deep-green/10 pt-5">
                <MithoButton variant="outline-secondary" asChild>
                  <Link href="/users">
                    Discover more creators
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </MithoButton>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep-green/10">
                <Users className="h-6 w-6 text-brand-deep-green" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-brand-dark-green">No followers yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Share your public collections and reviews so other Mitho creators can discover and follow your taste.
              </p>
              <div className="mt-5">
                <MithoButton variant="outline-secondary" asChild>
                  <Link href="/users">Browse creators</Link>
                </MithoButton>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function PublicStatsStrip({ profile }: { profile: PublicUserProfileData }) {
  return (
    <section className={sectionCardClass}>
      <div className="grid grid-cols-2 divide-x divide-y divide-brand-deep-green/10 px-6 py-2 sm:grid-cols-4 sm:divide-y-0 sm:px-8">
        <Link
          href={`/users/${profile.username}/followers`}
          className="flex items-center gap-4 py-5 transition-colors duration-200 hover:bg-muted sm:px-4"
        >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark-green/10">
              <Users className="h-5 w-5 text-brand-dark-green" />
            </span>
            <div>
              <p className="text-2xl font-bold leading-none text-brand-dark-green">{profile.followerCount}</p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Followers</p>
            </div>
        </Link>
        <Link
          href={`/users/${profile.username}/following`}
          className="flex items-center gap-4 py-5 transition-colors duration-200 hover:bg-muted sm:px-4"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
            <UserPlus className="h-5 w-5 text-brand-orange" />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none text-brand-orange">{profile.followingCount}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Following</p>
          </div>
        </Link>
        <div className="flex items-center gap-4 py-5 sm:px-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
            <Star className="h-5 w-5 text-brand-orange" />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none text-brand-orange">{profile.reviewCount}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Public reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-5 sm:px-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep-green/10">
            <Bookmark className="h-5 w-5 text-brand-deep-green" />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none text-brand-deep-green">{profile.collectionCount}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Public collections</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PublicCollectionsSection({ profile }: { profile: PublicUserProfileData }) {
  const [query, setQuery] = React.useState("")
  const deferredQuery = React.useDeferredValue(query.trim())
  const publicCollectionsQuery = usePublicCollections(profile.username, { perPage: 100 })
  const allCollections = publicCollectionsQuery.data?.items ?? []
  const filteredCollections = deferredQuery
    ? allCollections.filter((collection) =>
        [collection.title, collection.description ?? "", ...collection.items.map((item) => item.business?.name ?? "")]
          .join(" ")
          .toLowerCase()
          .includes(deferredQuery.toLowerCase()),
      )
    : allCollections
  const collectionsPage = filteredCollections.slice(0, PUBLIC_COLLECTION_PAGE_SIZE)
  const showSearch = allCollections.length > PUBLIC_COLLECTION_SEARCH_THRESHOLD
  const hasNoCollections = filteredCollections.length === 0
  const isSearching = deferredQuery.length > 0
  const resultLabel = isSearching
    ? `${filteredCollections.length} matching ${filteredCollections.length === 1 ? "collection" : "collections"}`
    : `Showing ${collectionsPage.length} of ${allCollections.length} collections`

  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <p className="type-eyebrow text-brand-deep-green/68">Public collections</p>
        <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">
          Food lists worth sharing, copying, or borrowing for the next meal plan.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          These are the lists {profile.name.split(" ")[0]} chose to publish so other people can browse them like ready-made local shortcuts.
        </p>
      </div>

      {allCollections.length > 0 ? (
        <div className="flex flex-col gap-3 border-b border-brand-deep-green/10 px-6 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
          {showSearch ? (
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 rounded-lg border-brand-deep-green/12 bg-muted pl-11 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                placeholder="Search public collections"
              />
            </div>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              Browse {profile.name.split(" ")[0]}'s public lists as ready-made shortcuts for the next meal plan.
            </p>
          )}
          <span className="text-sm text-muted-foreground">{resultLabel}</span>
        </div>
      ) : null}

      <div className="px-6 py-6 sm:px-8">
        {!hasNoCollections ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {collectionsPage.map((collection) => (
                <CollectionShowcaseCard
                  key={collection.id}
                  collection={collection}
                  href={`/users/${profile.username}/collections/${collection.id}`}
                />
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted p-6">
            <p className="text-base font-semibold text-brand-dark-green">No public collections match this search.</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Try another collection title, place name, or clear the search to see everything again.
            </p>
          </div>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            Public place lists will appear here once {profile.name.split(" ")[0]} decides a shortlist is worth sharing more widely.
          </p>
        )}
      </div>
    </section>
  )
}
function PublicReviewsSection({ profile }: { profile: PublicUserProfileData }) {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <p className="type-eyebrow text-brand-deep-green/68">Recent reviews</p>
        <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">
          Local notes that help the next person decide faster.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Recent public reviews stay short, useful, and food-first so the strongest recommendation signal is easy to scan.
        </p>
      </div>

      <div className="px-6 py-2 sm:px-8">
        {profile.recentPublicReviews.length > 0 ? (
          <div className="divide-y divide-brand-deep-green/10">
            {profile.recentPublicReviews.map((review) => (
              <div key={review.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={review.publicHref} className="text-lg font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
                      {review.businessName}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {review.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                        {review.rating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        {review.date}
                      </span>
                    </div>
                  </div>
                  <MithoBadge variant="muted">Review</MithoBadge>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{review.excerpt}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted p-6">
            <p className="text-base font-semibold text-brand-dark-green">No public reviews yet.</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Once public reviews are posted, this page will turn into a stronger local discovery signal.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function CreatorDiscoveryCard({ creator }: { creator: PublicCreatorItem }) {
  return (
    <Link
      href={`/users/${creator.username}`}
      className="group flex h-full flex-col rounded-xl border border-brand-deep-green/10 bg-white p-5 transition-colors duration-200 hover:border-brand-deep-green/18"
    >
      <div className="flex items-start gap-4">
        {creator.avatarUrl ? (
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="h-16 w-16 rounded-full border-4 border-brand-soft-beige object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-soft-beige bg-brand-deep-green/10 text-xl font-semibold text-brand-deep-green">
            {creator.name ? creator.name[0].toUpperCase() : "?"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <MithoBadge variant="muted">{creator.followerCount} followers</MithoBadge>
            <MithoBadge variant="neutral">{creator.collectionCount} collections</MithoBadge>
            <MithoBadge variant="muted">{creator.reviewCount} reviews</MithoBadge>
          </div>
          <h2 className="mt-3 line-clamp-2 text-xl font-semibold text-brand-dark-green">{creator.name}</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/58">
            @{creator.username}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function PublicUserDiscoveryPage() {
  const [inputQuery, setInputQuery] = React.useState("")
  const debouncedQuery = useDebouncedValue(inputQuery.trim(), 300)
  const [page, setPage] = React.useState(1)
  const [allItems, setAllItems] = React.useState<PublicCreatorItem[]>([])
  const appendRef = React.useRef(false)

  const hasQuery = debouncedQuery.length > 0

  React.useEffect(() => {
    setPage(1)
    appendRef.current = false
    if (!hasQuery) setAllItems([])
  }, [debouncedQuery, hasQuery])

  const { data, isLoading, isFetching } = usePublicCreatorDirectory({
    query: debouncedQuery,
    page,
    perPage: PUBLIC_CREATOR_DIRECTORY_PER_PAGE,
    enabled: hasQuery,
  })

  React.useEffect(() => {
    if (!data) return
    if (appendRef.current) {
      setAllItems((prev) => [...prev, ...data.items])
      appendRef.current = false
    } else {
      setAllItems(data.items)
    }
  }, [data])

  const handleShowMore = () => {
    appendRef.current = true
    setPage((p) => p + 1)
  }

  const totalItems = data?.meta.totalItems ?? 0
  const hasMore = data ? page < data.meta.totalPages : false

  const resultLabel = isLoading
    ? "Searching..."
    : hasQuery
      ? `${totalItems} matching ${totalItems === 1 ? "creator" : "creators"}`
      : null

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <p className="type-eyebrow text-brand-deep-green/68">Creator discovery</p>
            <h1 className="type-page-title mt-3 text-brand-dark-green">Browse the people building the best public food lists on Mitho.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              Search by name or username, then follow the public collections and review signals that feel worth borrowing for your next plan.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={inputQuery}
                  onChange={(event) => setInputQuery(event.target.value)}
                  className="h-12 rounded-lg border-border bg-muted pl-11 shadow-none focus-visible:border-primary focus-visible:ring-primary/25"
                  placeholder="Search creators by name or username"
                />
              </div>
              {resultLabel ? <span className="text-sm text-muted-foreground">{resultLabel}</span> : null}
            </div>

            {!hasQuery ? (
              <div className="rounded-xl border border-dashed border-border bg-muted p-6">
                <p className="text-base font-semibold text-foreground">Search to find creators.</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Type a name or username above to discover people who have built public food lists on Mitho.
                </p>
              </div>
            ) : isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : !allItems.length ? (
              <div className="rounded-xl border border-dashed border-border bg-muted p-6">
                <p className="text-base font-semibold text-foreground">No creators match this search.</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Try another name or username to keep browsing public profiles.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {allItems.map((creator) => (
                    <CreatorDiscoveryCard key={creator.userId} creator={creator} />
                  ))}
                </div>

                {hasMore ? (
                  <div className="flex justify-center">
                    <MithoButton
                      type="button"
                      variant="outline-secondary"
                      onClick={handleShowMore}
                      disabled={isFetching}
                    >
                      {isFetching ? "Loading more..." : "Show more"}
                    </MithoButton>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export function PublicUserProfilePage({ username }: { username: string }) {
  const { isAuthenticated, authUser } = useAuthSnapshot()
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingFollowAfterAuth, setPendingFollowAfterAuth] = React.useState(false)

  const profileQuery = usePublicProfile(username)
  const followMutation = useFollowUser(username)
  const unfollowMutation = useUnfollowUser(username)
  const publicCollectionsQuery = usePublicCollections(username, { perPage: 100 })

  React.useEffect(() => {
    setIsSignInOpen(false)
    setPendingFollowAfterAuth(false)
  }, [username])

  React.useEffect(() => {
    if (!isAuthenticated || !pendingFollowAfterAuth) return
    followMutation.mutate()
    setPendingFollowAfterAuth(false)
    setIsSignInOpen(false)
  }, [isAuthenticated, pendingFollowAfterAuth])

  if (profileQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-xl border border-brand-deep-green/10 bg-white/70" />
          <div className="h-24 animate-pulse rounded-xl border border-brand-deep-green/10 bg-white/70" />
        </div>
      </div>
    )
  }

  if (!profileQuery.data) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="rounded-xl border border-brand-deep-green/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="type-page-title text-brand-dark-green">This public profile is not available.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The user may not have published anything yet, or the profile link may no longer point to an active public page.
          </p>
        </div>
      </div>
    )
  }

  const apiProfile = profileQuery.data
  const profile: PublicUserProfileData = {
    ...apiProfile,
    avatarUrl: apiProfile.avatarUrl ?? "/placeholder.svg",
    collectionCount: publicCollectionsQuery.data?.items.length ?? apiProfile.collectionCount,
  }

  const profileWithCollections = profile
  const isOwnProfile = isAuthenticated && authUser?.user?.username === username
  const isToggling = followMutation.isPending || unfollowMutation.isPending

  const handleFollowToggle = () => {
    if (isOwnProfile || isToggling) return
    if (!isAuthenticated) {
      setPendingFollowAfterAuth(true)
      setIsSignInOpen(true)
      return
    }
    if (profile.isFollowedByCurrentUser) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-start gap-4">
                <img
                  src={profileWithCollections.avatarUrl}
                  alt={profileWithCollections.name}
                  className="h-20 w-20 rounded-full border-4 border-brand-soft-beige object-cover sm:h-24 sm:w-24"
                />
                <div className="min-w-0 flex-1">
                <h1 className="type-page-title mt-4 text-brand-dark-green">{profileWithCollections.name}</h1>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  @{profileWithCollections.username} · {profileWithCollections.joinedLabel}
                </p>
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground">{profileWithCollections.bio}</p>
                  <div className="shrink-0">
                    {!isOwnProfile ? (
                      <MithoButton
                        type="button"
                        variant={profileWithCollections.isFollowedByCurrentUser ? "outline-secondary" : "secondary"}
                        onClick={handleFollowToggle}
                        disabled={isToggling}
                        className="cursor-pointer"
                      >
                        {profileWithCollections.isFollowedByCurrentUser ? (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Follow
                          </>
                        )}
                      </MithoButton>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users className="h-4 w-4" />
                        This is your public profile
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </section>

          <PublicStatsStrip profile={profileWithCollections} />
          <PublicCollectionsSection profile={profileWithCollections} />
          <PublicReviewsSection profile={profileWithCollections} />
        </div>
      </div>

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={(open) => {
          setIsSignInOpen(open)
          if (!open) {
            setPendingFollowAfterAuth(false)
          }
        }}
        onContinue={() => {
          setIsSignInOpen(false)
        }}
        title="Sign in to follow creators whose taste you want to keep up with."
        description="Use Google to follow public Mitho creators, revisit their profiles, and keep their collections and reviews easy to find."
        helperCopy="Once sign-in completes, Mitho will keep you on this profile and finish the follow action automatically."
      />
    </>
  )
}

function PublicCreatorListPage({
  username,
  mode,
}: {
  username: string
  mode: "followers" | "following"
}) {
  const followersQuery = useFollowers(mode === "followers" ? username : "")
  const followingQuery = useUserFollowing(mode === "following" ? username : "")
  const activeQuery = mode === "followers" ? followersQuery : followingQuery
  const items = activeQuery.data?.items ?? []
  const totalItems = activeQuery.data?.meta.totalItems ?? items.length

  const heading = mode === "followers" ? `@${username}'s followers` : `@${username}'s following`
  const countLabel = mode === "followers" ? "followers" : "following"
  const emptyTitle = mode === "followers" ? "No followers yet" : "Not following anyone yet"
  const emptyDescription =
    mode === "followers"
      ? "Once people follow this creator, they will show up here."
      : "Once this creator follows other people, they will show up here."

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <MithoBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: `@${username}`, href: `/users/${username}` },
            { label: mode === "followers" ? "Followers" : "Following" },
          ]}
        />

        <section className={sectionCardClass}>
          {/* Page header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8">
            <h1 className="type-page-title text-brand-dark-green">{heading}</h1>
            <MithoBadge variant="neutral">{totalItems} {countLabel}</MithoBadge>
          </div>

          {/* List */}
          <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
            {activeQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-40 animate-pulse rounded-xl border border-brand-deep-green/10 bg-muted" />
                ))}
              </div>
            ) : activeQuery.isError ? (
              <div className="py-10 text-center">
                <p className="text-sm leading-7 text-muted-foreground">Could not load this list right now. Please try again shortly.</p>
              </div>
            ) : items.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((profile) => (
                  <CreatorFollowCard key={profile.userId} item={profile} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep-green/10">
                  <Users className="h-6 w-6 text-brand-deep-green" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-brand-dark-green">{emptyTitle}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">{emptyDescription}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export function PublicFollowersPage({ username }: { username: string }) {
  return <PublicCreatorListPage username={username} mode="followers" />
}

export function PublicFollowingPage({ username }: { username: string }) {
  return <PublicCreatorListPage username={username} mode="following" />
}

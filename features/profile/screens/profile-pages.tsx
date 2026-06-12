"use client"

import Link from "next/link"
import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bookmark, Building2, Camera, ChevronRight, Clock3, Copy, Globe, Lock, Mail, MapPin, MessageSquare, Search, Settings, ShieldAlert, Star, Trash2, UserCheck, UserPlus, Users } from "lucide-react"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { useAuthSnapshot, useLogout } from "@/hooks/use-auth-session"
import { useCollections, usePublicCollections } from "@/hooks/use-collections"
import { useMyReviews } from "@/hooks/use-reviews"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import type { ReviewItem, ReviewStatus } from "@/types/reviews"
import { getCollectionCoverImages, getCollectionPlaceCount } from "@/features/collections/utils/collection-helpers"
import { CollectionShowcaseCard } from "@/features/collections/components/collection-showcase-card"
import {
  followPublicProfile,
  getFollowingProfiles,
  mockCustomerProfile,
  unfollowPublicProfile,
  type FollowingProfileListItem,
  type PublicUserProfileData,
} from "@/features/profile/data/profile-data"
import type { PublicCreatorItem } from "@/lib/api/profile"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useFollowUser, usePublicCreatorDirectory, usePublicProfile, useUnfollowUser } from "@/hooks/use-profile"
import { ProfileNavigation } from "@/features/profile/components/profile-navigation"
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
  const businessContext = mockCustomerProfile.businessContext

  if (businessContext.status === "none") return null

  return (
    <div className="border-t border-brand-deep-green/10 px-6 py-5 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-deep-green/10 text-brand-deep-green">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {businessContext.status === "approved" ? (
              <>
                <MithoBadge variant="success">Business access live</MithoBadge>
                <MithoBadge variant="muted">{businessContext.managedCount} workspace</MithoBadge>
              </>
            ) : (
              <>
                <MithoBadge variant="warning">Claim pending</MithoBadge>
                <span className="text-sm text-muted-foreground">
                  {businessContext.pendingLabel ?? "Ownership claim under review."}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {businessContext.status === "approved" ? (
            <>
              <MithoButton variant="outline-secondary" size="sm" asChild>
                <Link href="/dashboard/businesses">
                  Manage businesses
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </MithoButton>
              <MithoButton variant="ghost" size="sm" asChild>
                <Link href="/business/claim">Claim another</Link>
              </MithoButton>
            </>
          ) : (
            <MithoButton variant="outline-secondary" size="sm" asChild>
              <Link href="/business/claim">Review claim</Link>
            </MithoButton>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProfileHubPage() {
  const collectionsQuery = useCollections({ perPage: 3 })
  const recentReviewsQuery = useMyReviews({ perPage: 3 })
  const recentReviews = recentReviewsQuery.data?.items ?? []
  const previewCollections = collectionsQuery.data?.items ?? []
  const collectionCount = collectionsQuery.data?.meta.total ?? 0
  const placeCountAcrossCollections = previewCollections.reduce((total, collection) => total + collection.itemCount, 0)
  const stats = [
    { label: "Reviews written", value: recentReviewsQuery.data?.meta.total ?? 0, icon: Star, accent: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Collections", value: collectionCount, icon: Bookmark, accent: "text-brand-deep-green", bg: "bg-brand-deep-green/10" },
    { label: "Places saved", value: placeCountAcrossCollections, icon: MapPin, accent: "text-brand-dark-green", bg: "bg-brand-dark-green/10" },
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
              <img
                src={mockCustomerProfile.avatarUrl}
                alt={mockCustomerProfile.name}
                className="h-16 w-16 rounded-full border-4 border-brand-soft-beige object-cover sm:h-20 sm:w-20"
              />
              <div>
                <h1 className="type-page-title text-brand-dark-green">{mockCustomerProfile.name}</h1>
                <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  {mockCustomerProfile.joinedLabel}
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{mockCustomerProfile.bio}</p>
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
          <div className="grid grid-cols-1 divide-y divide-brand-deep-green/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-6 py-5 sm:px-8">
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.accent}`} />
                </span>
                <div>
                  <p className={`text-2xl font-bold leading-none ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
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
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{review.body}</p>
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

function reviewBusinessHref(review: ReviewItem) {
  return review.businessSlug ? `/business/${review.businessSlug}` : null
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
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{review.body}</p>
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

export function ProfileSettingsPage() {
  const router = useRouter()
  const { currentUser } = useAuthSnapshot()
  const logout = useLogout()
  const initialForm = React.useMemo(
    () => ({
      name: currentUser?.name ?? mockCustomerProfile.name,
      avatarUrl: currentUser?.avatarUrl ?? mockCustomerProfile.avatarUrl,
      bio: mockCustomerProfile.bio,
      mobileNumber: mockCustomerProfile.mobileNumber,
      address: mockCustomerProfile.address,
    }),
    [currentUser],
  )
  const [form, setForm] = React.useState(initialForm)
  const [saved, setSaved] = React.useState(false)
  const [isDeleteBlockedOpen, setIsDeleteBlockedOpen] = React.useState(false)
  const [accountDeletionComplete, setAccountDeletionComplete] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const hasManagedBusinesses =
    mockCustomerProfile.businessContext.status === "approved" && (mockCustomerProfile.businessContext.managedCount ?? 0) > 0

  React.useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const updateForm = (field: keyof typeof form, value: string) => {
    setSaved(false)
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateForm("avatarUrl", reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  if (accountDeletionComplete) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="space-y-6">
          <ProfileTabsPanel />

          <section className={sectionCardClass}>
            <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
              <MithoBadge variant="warning">Deletion request staged</MithoBadge>
              <h2 className="mt-4 text-2xl font-semibold text-brand-dark-green">This account would now move into the deletion flow.</h2>
            </div>
            <div className="space-y-4 px-6 py-6 sm:px-8">
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Personal profile access, collections, follows, and review identity would be handled here according to Mitho&apos;s future backend deletion rules.
              </p>
              <div className="flex flex-wrap gap-3">
                <MithoButton
                  onClick={async () => {
                    await logout.mutateAsync()
                    router.push("/")
                  }}
                >
                  Return home
                </MithoButton>
                <MithoButton variant="outline-secondary" onClick={() => setAccountDeletionComplete(false)}>
                  Back to settings
                </MithoButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
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
                  <img src={form.avatarUrl} alt={form.name} className="h-28 w-28 rounded-full object-cover" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="mt-4 space-y-3 flex flex-col items-center">
                  <MithoButton type="button" variant="outline-secondary" onClick={() => fileInputRef.current?.click()} leftIcon={<Camera className="h-4 w-4" />}>
                    Upload image
                  </MithoButton>
                  <p className="text-xs leading-6 text-muted-foreground">Use a clear square photo that still looks good at small sizes.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Display name</span>
                <Input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className="h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                />
              </label>

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
                    value={form.mobileNumber}
                    onChange={(event) => updateForm("mobileNumber", event.target.value)}
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
                {saved ? <span className="text-sm font-medium text-success">Profile details updated in this mock flow.</span> : null}
                <MithoButton
                  variant="outline-secondary"
                  onClick={() => {
                    setForm(initialForm)
                    setSaved(false)
                  }}
                >
                  Discard changes
                </MithoButton>
                <MithoButton onClick={() => setSaved(true)}>Save changes</MithoButton>
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
              <Input value={mockCustomerProfile.email} disabled className="mt-4 h-12 rounded-lg border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">This comes from Google sign-in and stays read-only here for trust and account recovery consistency.</p>
            </div>

            <div className="rounded-xl border border-brand-deep-green/10 bg-muted p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green">
                <Lock className="h-4 w-4 text-brand-orange" />
                Username
              </div>
              <Input value={`@${mockCustomerProfile.username}`} disabled className="mt-4 h-12 rounded-lg border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Username is fixed for now so public profile links and creator identity do not unexpectedly change.</p>
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
                    Use this when you want Mitho to remove your account under a GDPR-style self-serve flow. This is separate from logging out.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {hasManagedBusinesses ? (
                  <>
                    <MithoButton variant="outline-danger" onClick={() => setIsDeleteBlockedOpen(true)}>
                      Review deletion requirements
                    </MithoButton>
                    <Dialog open={isDeleteBlockedOpen} onOpenChange={setIsDeleteBlockedOpen}>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Account deletion is blocked until business responsibility is resolved.</DialogTitle>
                          <DialogDescription>
                            This account currently manages {mockCustomerProfile.businessContext.managedCount} business workspace. Mitho should not delete the account until ownership or management responsibility has been handled safely.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="rounded-lg border border-brand-deep-green/10 bg-muted p-4">
                            <div className="flex items-start gap-3">
                              <ShieldAlert className="mt-0.5 h-4 w-4 text-brand-orange" />
                              <div className="text-sm leading-7 text-muted-foreground">
                                Before final deletion, the user should transfer ownership, remove themselves from managed businesses, or resolve sole-owner cases according to Mitho&apos;s business lifecycle policy.
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm leading-7 text-muted-foreground">
                            <p>Required next steps:</p>
                            <p>1. Transfer ownership if another eligible user should take over.</p>
                            <p>2. Remove yourself from managed businesses if you are not the long-term operator.</p>
                            <p>3. If you are the last owner, convert the business to an unclaimed state before account deletion.</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <MithoButton variant="outline-secondary" onClick={() => setIsDeleteBlockedOpen(false)}>
                            Back
                          </MithoButton>
                          <MithoButton asChild>
                            <Link href="/dashboard/businesses">Manage businesses first</Link>
                          </MithoButton>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <MithoButton variant="outline-danger">Delete account</MithoButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this Mitho account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This would begin the self-serve deletion flow for your profile, reviews, follows, and private account state. This action is more final than logging out.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep account</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-danger text-danger-foreground hover:bg-danger/90"
                          onClick={() => setAccountDeletionComplete(true)}
                        >
                          Continue deletion
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export function ProfileFollowingPage() {
  const [followingProfiles, setFollowingProfiles] = React.useState<FollowingProfileListItem[]>(() => getFollowingProfiles())

  const handleUnfollow = (username: string) => {
    unfollowPublicProfile(username)
    setFollowingProfiles(getFollowingProfiles())
  }

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
          <MithoBadge variant="neutral">{followingProfiles.length} following</MithoBadge>
        </div>

        {/* Following list */}
        <div className="border-t border-brand-deep-green/10 px-6 py-6 sm:px-8">
          {followingProfiles.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {followingProfiles.map((profile) => (
                  <div
                    key={profile.userId}
                    className="rounded-xl border border-brand-deep-green/10 bg-muted p-5 transition-colors duration-200 hover:border-brand-deep-green/18"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Link href={`/users/${profile.username}`} className="flex min-w-0 items-start gap-3">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="h-12 w-12 rounded-full border-2 border-brand-soft-beige object-cover"
                        />
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
                        onClick={() => handleUnfollow(profile.username)}
                      >
                        <UserCheck className="h-4 w-4" />
                        Following
                      </MithoButton>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <MithoBadge variant="muted">{profile.followerCount} followers</MithoBadge>
                      <MithoBadge variant="neutral">{profile.publicCollectionCount} collections</MithoBadge>
                      <MithoBadge variant="muted">{profile.reviewCount} reviews</MithoBadge>
                    </div>
                  </div>
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

function PublicStatsStrip({ profile }: { profile: PublicUserProfileData }) {
  return (
    <section className={sectionCardClass}>
      <div className="grid divide-y divide-brand-deep-green/10 px-6 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
        <div className="flex items-center gap-4 py-5 sm:px-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark-green/10">
              <Users className="h-5 w-5 text-brand-dark-green" />
            </span>
            <div>
              <p className="text-2xl font-bold leading-none text-brand-dark-green">{profile.followerCount}</p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Followers</p>
            </div>
        </div>
        <div className="flex items-center gap-4 py-5 sm:px-4 sm:justify-center">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
            <Star className="h-5 w-5 text-brand-orange" />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none text-brand-orange">{profile.reviewCount}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">Public reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-5 sm:px-4 sm:justify-end">
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

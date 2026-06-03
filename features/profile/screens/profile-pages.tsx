"use client"

import Link from "next/link"
import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bookmark, Building2, Camera, ChevronRight, Clock3, Copy, Globe, Lock, Mail, MapPin, MessageSquare, Search, Settings, ShieldAlert, Star, Trash2, UserCheck, UserPlus, Users } from "lucide-react"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { useAuthSnapshot, useLogout } from "@/hooks/use-auth-session"
import { getCollectionCoverImages, getCollectionPlaceCount, ownedCollections } from "@/features/collections/data/collection-data"
import { CollectionShowcaseCard } from "@/features/collections/components/collection-showcase-card"
import {
  followPublicProfile,
  getFollowingProfiles,
  getPublicCreatorDirectoryPage,
  getPublicProfileByUsername,
  getPublicProfileCollectionsPage,
  mockCustomerProfile,
  unfollowPublicProfile,
  type FollowingProfileListItem,
  type PublicCreatorDiscoveryItem,
  type PublicUserProfileData,
} from "@/features/profile/data/profile-data"
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
  "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"
const PUBLIC_COLLECTION_PAGE_SIZE = 12
const PUBLIC_COLLECTION_SEARCH_THRESHOLD = 6
const PUBLIC_CREATOR_DIRECTORY_PAGE_SIZE = 4

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <p className="type-eyebrow text-brand-deep-green/68">{eyebrow}</p>
        <h1 className="type-page-title mt-3 text-brand-dark-green">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="px-6 py-5 sm:px-8">
        <ProfileNavigation />
      </div>
    </section>
  )
}

function StatsStrip() {
  const stats = [
    { label: "Reviews written", value: mockCustomerProfile.reviewCount, accent: "text-brand-orange" },
    { label: "Collections", value: mockCustomerProfile.collectionCount, accent: "text-brand-deep-green" },
    { label: "Places across collections", value: mockCustomerProfile.placeCountAcrossCollections, accent: "text-brand-dark-green" },
    { label: "Cities explored", value: mockCustomerProfile.citiesExplored, accent: "text-brand-dark-green" },
  ]

  return (
    <section className={sectionCardClass}>
      <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] px-5 py-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function QuickLinkGrid() {
  const links = [
    {
      href: "/profile/reviews",
      icon: MessageSquare,
      title: "My reviews",
      description: "Revisit what you have already shared and where your local notes are helping others decide.",
    },
    {
      href: "/collections",
      icon: Bookmark,
      title: "Collections",
      description: "Build personal food lists, keep private planning boards, and copy strong public collections into your own account.",
    },
    {
      href: "/profile/settings",
      icon: Settings,
      title: "Account settings",
      description: "Update your profile details and keep the basics around your Mitho account tidy.",
    },
  ]

  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <p className="type-eyebrow text-brand-deep-green/68">Quick links</p>
        <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Jump straight into the parts of your account that matter most.</h2>
      </div>
      <div className="grid gap-4 px-6 py-6 md:grid-cols-3 sm:px-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-[1.45rem] border border-brand-deep-green/10 bg-white px-5 py-5 transition-all duration-200 hover:border-brand-deep-green/18 hover:shadow-[0_12px_28px_rgba(10,70,53,0.07)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft-beige/75 text-brand-deep-green">
              <link.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark-green">{link.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p>
              </div>
              <ChevronRight className="mt-0.5 h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function BusinessModule() {
  const businessContext = mockCustomerProfile.businessContext

  if (businessContext.status === "none") return null

  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-deep-green/10 text-brand-deep-green">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="type-eyebrow text-brand-deep-green/68">Business access</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-dark-green">Business management stays connected to the same Mitho account.</h2>
          </div>
        </div>
      </div>
      <div className="space-y-4 px-6 py-6">
        {businessContext.status === "approved" ? (
          <>
            <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <MithoBadge variant="success">Business access live</MithoBadge>
                <MithoBadge variant="muted">{businessContext.managedCount} workspace</MithoBadge>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                You can keep reviewing and saving places here while still managing your business workspace from the same account.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MithoButton variant="secondary" asChild>
                <Link href="/dashboard/businesses">
                  Manage businesses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/business/claim">Claim another business</Link>
              </MithoButton>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <MithoBadge variant="warning">Claim pending</MithoBadge>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {businessContext.pendingLabel ??
                  "Your ownership claim is still being reviewed. We will email you once the admin team approves or rejects it."}
              </p>
            </div>
            <MithoButton variant="outline-secondary" asChild>
              <Link href="/business/claim">Review claim details</Link>
            </MithoButton>
          </>
        )}
      </div>
    </section>
  )
}

function ReviewPreviewList() {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-eyebrow text-brand-deep-green/68">Recent reviews</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">The local notes you have recently added to Mitho.</h2>
          </div>
          <MithoButton variant="outline-secondary" asChild>
            <Link href="/profile/reviews">View all reviews</Link>
          </MithoButton>
        </div>
      </div>

      <div className="divide-y divide-brand-deep-green/10 px-6 sm:px-8">
        {mockCustomerProfile.recentReviews.slice(0, 3).map((review) => (
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
    </section>
  )
}

function CollectionPreviewList() {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-eyebrow text-brand-deep-green/68">Collections</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">The place lists you can keep private, publish, or copy forward into better plans.</h2>
          </div>
          <MithoButton variant="outline-secondary" asChild>
            <Link href="/collections">Open collections</Link>
          </MithoButton>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 md:grid-cols-2 sm:px-8">
        {ownedCollections.slice(0, 3).map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-4 transition-all duration-200 hover:border-brand-deep-green/18 hover:shadow-[0_12px_28px_rgba(10,70,53,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="line-clamp-1 text-base font-semibold text-brand-dark-green">{collection.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {collection.description ?? "A place list you can refine once it starts filling out."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {collection.visibility === "public" ? (
                    <MithoBadge variant="neutral" className="gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      Public
                    </MithoBadge>
                  ) : (
                    <MithoBadge variant="muted" className="gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      Private
                    </MithoBadge>
                  )}
                  {collection.provenance ? <MithoBadge variant="outline-orange" className="gap-1"><Copy className="h-3.5 w-3.5" />Copied</MithoBadge> : null}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {getCollectionCoverImages(collection).slice(0, 3).map((imageUrl, index) => (
                <img key={`${collection.id}-${index}`} src={imageUrl} alt="" className="h-14 w-14 rounded-[1rem] object-cover" />
              ))}
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
              {getCollectionPlaceCount(collection)} places · {collection.updatedLabel}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ProfileHubPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <ProfileNavigation />
          </div>
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_220px] sm:px-8">
            <div className="flex items-start gap-4">
              <img
                src={mockCustomerProfile.avatarUrl}
                alt={mockCustomerProfile.name}
                className="h-20 w-20 rounded-full border-4 border-brand-soft-beige object-cover sm:h-24 sm:w-24"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <MithoBadge variant="neutral">Customer profile</MithoBadge>
                  <MithoBadge variant="muted">{mockCustomerProfile.trustCue}</MithoBadge>
                </div>
                <h1 className="type-page-title mt-4 text-brand-dark-green">{mockCustomerProfile.name}</h1>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  {mockCustomerProfile.joinedLabel}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{mockCustomerProfile.bio}</p>
              </div>
            </div>

            <div className="flex items-start justify-end lg:justify-start">
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/profile/settings">
                  Open settings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </div>
          </div>
        </section>

        <StatsStrip />
        <QuickLinkGrid />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <ReviewPreviewList />
            <CollectionPreviewList />
          </div>

          <div className="space-y-6">
            <BusinessModule />

            <section className={sectionCardClass}>
              <div className="px-6 py-6">
                <p className="type-eyebrow text-brand-deep-green/68">Profile rhythm</p>
                <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Use this page as the calmer customer base, then go deeper only when you need to.</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-3">
                    <Bookmark className="mt-0.5 h-4 w-4 text-brand-deep-green" />
                    Collections are the place to keep shortlists, bucket lists, and copied public finds in one calmer system.
                  </li>
                  <li className="flex gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-brand-deep-green" />
                    Reviews remain your strongest local contribution signal.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Customer account"
          title="Your reviews in one place."
          description="Revisit the notes you have already shared, then jump back into the business pages where those reviews are doing the real work."
        />

        <section className={sectionCardClass}>
          <div className="divide-y divide-brand-deep-green/10 px-6 sm:px-8">
            {mockCustomerProfile.recentReviews.map((review) => (
              <div key={review.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={review.publicHref} className="text-xl font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
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
                  <MithoButton variant="ghost" size="sm" asChild>
                    <Link href={review.publicHref}>Open business</Link>
                  </MithoButton>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{review.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
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
          <PageIntro
            eyebrow="Account deletion"
            title="Your account deletion request has been captured in this mock flow."
            description="In the full product, this is where Mitho would confirm the request, sign you out, and continue the deletion workflow according to account and business-ownership policy."
          />

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
        <PageIntro
          eyebrow="Customer account"
          title="Keep your Mitho identity tidy without touching public account rules."
          description="Update the profile basics people see, review the locked account credentials tied to Google sign-in, and manage account lifecycle actions from one clear place."
        />

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <p className="type-eyebrow text-brand-deep-green/68">Profile details</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Edit the basics people connect to your account.</h2>
          </div>
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)] sm:px-8">
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
                <div className="mx-auto w-fit rounded-full border border-brand-deep-green/10 bg-white p-2 shadow-[0_8px_20px_rgba(10,70,53,0.06)]">
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
                  className="h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Short bio</span>
                <Textarea
                  value={form.bio}
                  onChange={(event) => updateForm("bio", event.target.value)}
                  rows={5}
                  className="rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Mobile number</span>
                  <Input
                    value={form.mobileNumber}
                    onChange={(event) => updateForm("mobileNumber", event.target.value)}
                    className="h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Address</span>
                  <Input
                    value={form.address}
                    onChange={(event) => updateForm("address", event.target.value)}
                    className="h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
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
            <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green">
                <Mail className="h-4 w-4 text-brand-orange" />
                Account email
              </div>
              <Input value={mockCustomerProfile.email} disabled className="mt-4 h-12 rounded-[1rem] border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">This comes from Google sign-in and stays read-only here for trust and account recovery consistency.</p>
            </div>

            <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark-green">
                <Lock className="h-4 w-4 text-brand-orange" />
                Username
              </div>
              <Input value={`@${mockCustomerProfile.username}`} disabled className="mt-4 h-12 rounded-[1rem] border-brand-deep-green/12 bg-white px-4 text-muted-foreground disabled:opacity-100" />
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
            <div className="rounded-[1.35rem] border border-danger/15 bg-danger/5 p-5">
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
                          <div className="rounded-[1rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
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
      <div className="space-y-6">
        <PageIntro
          eyebrow="People you follow"
          title="Keep your trusted creators close."
          description="Following is a lightweight way to remember whose public collections and reviews keep leading you to better food decisions."
        />

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="type-eyebrow text-brand-deep-green/68">Following</p>
                <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">Creators you chose to keep up with.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Their public collections and review signals can stay easy to revisit from one signed-in place.
                </p>
              </div>
              <MithoBadge variant="neutral">{followingProfiles.length} following</MithoBadge>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {followingProfiles.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {followingProfiles.map((profile) => (
                  <div
                    key={profile.userId}
                    className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Link href={`/users/${profile.username}`} className="flex min-w-0 items-start gap-4">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="h-14 w-14 rounded-full border-4 border-brand-soft-beige object-cover"
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-brand-dark-green">{profile.name}</h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/58">
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

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <MithoBadge variant="muted">{profile.followerCount} followers</MithoBadge>
                      <MithoBadge variant="neutral">{profile.publicCollectionCount} collections</MithoBadge>
                      <MithoBadge variant="muted">{profile.reviewCount} reviews</MithoBadge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
                <p className="text-base font-semibold text-brand-dark-green">You are not following anyone yet.</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Follow public creators whose collections and reviews feel worth revisiting, and they will appear here for quick access.
                </p>
                <div className="mt-4">
                  <MithoButton variant="outline-secondary" asChild>
                    <Link href="/users">Browse creators</Link>
                  </MithoButton>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
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
  const [isPending, startTransition] = React.useTransition()
  const [collectionsPage, setCollectionsPage] = React.useState(() =>
    getPublicProfileCollectionsPage({
      username: profile.username,
      limit: PUBLIC_COLLECTION_PAGE_SIZE,
    }),
  )

  const showSearch = profile.collectionCount > PUBLIC_COLLECTION_SEARCH_THRESHOLD

  React.useEffect(() => {
    setQuery("")
  }, [profile.username])

  React.useEffect(() => {
    startTransition(() => {
      setCollectionsPage(
        getPublicProfileCollectionsPage({
          username: profile.username,
          query: deferredQuery,
          limit: PUBLIC_COLLECTION_PAGE_SIZE,
        }),
      )
    })
  }, [deferredQuery, profile.username])

  const handleShowMore = () => {
    if (!collectionsPage.nextCursor) return

    startTransition(() => {
      const nextPage = getPublicProfileCollectionsPage({
        username: profile.username,
        query: deferredQuery,
        limit: PUBLIC_COLLECTION_PAGE_SIZE,
        cursor: collectionsPage.nextCursor,
      })

      setCollectionsPage((currentPage) => ({
        items: [...currentPage.items, ...nextPage.items],
        totalCount: nextPage.totalCount,
        nextCursor: nextPage.nextCursor,
        hasMore: nextPage.hasMore,
      }))
    })
  }

  const hasNoCollections = collectionsPage.totalCount === 0
  const isSearching = deferredQuery.length > 0
  const resultLabel = isSearching
    ? `${collectionsPage.totalCount} matching ${collectionsPage.totalCount === 1 ? "collection" : "collections"}`
    : `Showing ${collectionsPage.items.length} of ${collectionsPage.totalCount} collections`

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

      {profile.collectionCount > 0 ? (
        <div className="flex flex-col gap-3 border-b border-brand-deep-green/10 px-6 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
          {showSearch ? (
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] pl-11 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
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
              {collectionsPage.items.map((collection) => (
                <CollectionShowcaseCard
                  key={collection.id}
                  collection={collection}
                  href={`/users/${profile.username}/collections/${collection.id}`}
                />
              ))}
            </div>
            {collectionsPage.hasMore ? (
              <div className="flex justify-center">
                <MithoButton
                  type="button"
                  variant="outline-secondary"
                  onClick={handleShowMore}
                  disabled={isPending}
                >
                  {isPending ? "Loading more..." : "Show more"}
                </MithoButton>
              </div>
            ) : null}
          </div>
        ) : isSearching ? (
          <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
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
          <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
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

function CreatorDiscoveryCard({ creator }: { creator: PublicCreatorDiscoveryItem }) {
  return (
    <Link
      href={`/users/${creator.username}`}
      className="group flex h-full flex-col rounded-[1.55rem] border border-brand-deep-green/10 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-deep-green/18 hover:shadow-[0_16px_34px_rgba(10,70,53,0.08)]"
    >
      <div className="flex items-start gap-4">
        <img
          src={creator.avatarUrl}
          alt={creator.name}
          className="h-16 w-16 rounded-full border-4 border-brand-soft-beige object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <MithoBadge variant="muted">{creator.followerCount} followers</MithoBadge>
            <MithoBadge variant="neutral">{creator.publicCollectionCount} collections</MithoBadge>
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
  const [query, setQuery] = React.useState("")
  const deferredQuery = React.useDeferredValue(query.trim())
  const [isPending, startTransition] = React.useTransition()
  const [directoryPage, setDirectoryPage] = React.useState(() =>
    getPublicCreatorDirectoryPage({ limit: PUBLIC_CREATOR_DIRECTORY_PAGE_SIZE }),
  )

  React.useEffect(() => {
    startTransition(() => {
      setDirectoryPage(
        getPublicCreatorDirectoryPage({
          query: deferredQuery,
          limit: PUBLIC_CREATOR_DIRECTORY_PAGE_SIZE,
        }),
      )
    })
  }, [deferredQuery])

  const handleShowMore = () => {
    if (!directoryPage.nextCursor) return

    startTransition(() => {
      const nextPage = getPublicCreatorDirectoryPage({
        query: deferredQuery,
        limit: PUBLIC_CREATOR_DIRECTORY_PAGE_SIZE,
        cursor: directoryPage.nextCursor,
      })

      setDirectoryPage((currentPage) => ({
        items: [...currentPage.items, ...nextPage.items],
        totalCount: nextPage.totalCount,
        nextCursor: nextPage.nextCursor,
        hasMore: nextPage.hasMore,
      }))
    })
  }

  const isSearching = deferredQuery.length > 0
  const resultLabel = isSearching
    ? `${directoryPage.totalCount} matching ${directoryPage.totalCount === 1 ? "creator" : "creators"}`
    : `Showing ${directoryPage.items.length} of ${directoryPage.totalCount} creators`

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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] pl-11 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                  placeholder="Search creators by name or username"
                />
              </div>
              <span className="text-sm text-muted-foreground">{resultLabel}</span>
            </div>

            {!directoryPage.totalCount ? (
              <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
                <p className="text-base font-semibold text-brand-dark-green">
                  {isSearching ? "No creators match this search." : "Public creators will appear here soon."}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {isSearching
                    ? "Try another name or username to keep browsing public profiles."
                    : "Once more people publish their collections and reviews, this page will become a stronger discovery layer."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {directoryPage.items.map((creator) => (
                    <CreatorDiscoveryCard key={creator.username} creator={creator} />
                  ))}
                </div>

                {directoryPage.hasMore ? (
                  <div className="flex justify-center">
                    <MithoButton
                      type="button"
                      variant="outline-secondary"
                      onClick={handleShowMore}
                      disabled={isPending}
                    >
                      {isPending ? "Loading more..." : "Show more"}
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
  const { isAuthenticated } = useAuthSnapshot()
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingFollowAfterAuth, setPendingFollowAfterAuth] = React.useState(false)
  const [profile, setProfile] = React.useState(() => getPublicProfileByUsername(username))

  React.useEffect(() => {
    setIsSignInOpen(false)
    setPendingFollowAfterAuth(false)
    setProfile(getPublicProfileByUsername(username))
  }, [username])

  React.useEffect(() => {
    if (!isAuthenticated || !pendingFollowAfterAuth || !profile || profile.isFollowedByCurrentUser) return

    followPublicProfile(profile.username)
    setPendingFollowAfterAuth(false)
    setIsSignInOpen(false)
    setProfile(getPublicProfileByUsername(username))
  }, [isAuthenticated, pendingFollowAfterAuth, profile, username])

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-6 py-8 shadow-[0_12px_30px_rgba(10,70,53,0.05)] sm:px-8">
          <h1 className="type-page-title text-brand-dark-green">This public profile is not available.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The user may not have published anything yet, or the profile link may no longer point to an active public page.
          </p>
        </div>
      </div>
    )
  }

  const isOwnProfile = isAuthenticated && profile.username === mockCustomerProfile.username

  const syncProfile = () => {
    setProfile(getPublicProfileByUsername(username))
  }

  const handleFollowToggle = () => {
    if (isOwnProfile) return

    if (!isAuthenticated) {
      setPendingFollowAfterAuth(true)
      setIsSignInOpen(true)
      return
    }

    if (profile.isFollowedByCurrentUser) {
      unfollowPublicProfile(profile.username)
    } else {
      followPublicProfile(profile.username)
    }

    syncProfile()
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-start gap-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full border-4 border-brand-soft-beige object-cover sm:h-24 sm:w-24"
                />
                <div className="min-w-0 flex-1">
                <h1 className="type-page-title mt-4 text-brand-dark-green">{profile.name}</h1>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">
                  @{profile.username} · {profile.joinedLabel}
                </p>
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground">{profile.bio}</p>
                  <div className="shrink-0">
                    {!isOwnProfile ? (
                      <MithoButton
                        type="button"
                        variant={profile.isFollowedByCurrentUser ? "outline-secondary" : "secondary"}
                        onClick={handleFollowToggle}
                      >
                        {profile.isFollowedByCurrentUser ? (
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

          <PublicStatsStrip profile={profile} />
          <PublicCollectionsSection profile={profile} />
          <PublicReviewsSection profile={profile} />
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

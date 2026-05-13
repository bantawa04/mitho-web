import Link from "next/link"
import { ArrowRight, Bookmark, Building2, ChevronRight, Clock3, Heart, MapPin, MessageSquare, Settings, Star } from "lucide-react"
import { mockCustomerProfile } from "@/components/profile/profile-data"
import { ProfileNavigation } from "@/components/profile/profile-navigation"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"

const sectionCardClass =
  "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"

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
    { label: "Saved places", value: mockCustomerProfile.savedCount, accent: "text-brand-deep-green" },
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
      href: "/profile/saved",
      icon: Heart,
      title: "Saved places",
      description: "Keep the shortlist of places you want to revisit, compare, or send to someone before dinner.",
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

function SavedPreviewList() {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-eyebrow text-brand-deep-green/68">Saved places</p>
            <h2 className="mt-3 text-2xl font-semibold text-brand-dark-green">A tighter shortlist of places you want to revisit, compare, or share.</h2>
          </div>
          <MithoButton variant="outline-secondary" asChild>
            <Link href="/profile/saved">Open saved places</Link>
          </MithoButton>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 md:grid-cols-2 sm:px-8">
        {mockCustomerProfile.savedPlaces.slice(0, 4).map((place) => (
          <Link
            key={place.id}
            href={place.publicHref}
            className="flex gap-4 rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-4 transition-all duration-200 hover:border-brand-deep-green/18 hover:shadow-[0_12px_28px_rgba(10,70,53,0.06)]"
          >
            <img src={place.imageUrl} alt={place.name} className="h-20 w-20 rounded-[1rem] object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="line-clamp-1 text-base font-semibold text-brand-dark-green">{place.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{place.cuisine}</p>
                </div>
                <Heart className="mt-0.5 h-4 w-4 fill-brand-orange text-brand-orange" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{place.location}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">{place.savedDate}</p>
            </div>
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
            <SavedPreviewList />
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
                    Saved places stay quick to scan here before you move into the fuller list.
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

export function ProfileSavedPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Customer account"
          title="Saved places you want to keep close."
          description="This is the shortlist you can revisit before dinner plans firm up, or before you send someone a quick recommendation."
        />

        <section className={sectionCardClass}>
          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 sm:px-8">
            {mockCustomerProfile.savedPlaces.map((place) => (
              <Link
                key={place.id}
                href={place.publicHref}
                className="flex gap-4 rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-4 transition-all duration-200 hover:border-brand-deep-green/18 hover:shadow-[0_12px_28px_rgba(10,70,53,0.06)]"
              >
                <img src={place.imageUrl} alt={place.name} className="h-24 w-24 rounded-[1rem] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="line-clamp-1 text-lg font-semibold text-brand-dark-green">{place.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{place.cuisine}</p>
                    </div>
                    <Heart className="mt-0.5 h-4 w-4 fill-brand-orange text-brand-orange" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{place.location}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-deep-green/58">{place.savedDate}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export function ProfileSettingsPage() {
  const settingsCards = [
    {
      title: "Profile details",
      description: "Display name, avatar, and short profile notes will eventually be edited here rather than on the overview page.",
    },
    {
      title: "Account email",
      description: "Google sign-in and account contact details should stay easy to confirm without mixing them into business settings.",
    },
    {
      title: "Notifications",
      description: "Review replies, save reminders, and business-claim status updates can eventually live under the same customer account settings.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Customer account"
          title="Account settings will own profile editing."
          description="The overview page stays read-only on purpose. This route is where personal details and preferences can deepen when the backend account model is ready."
        />

        <section className={sectionCardClass}>
          <div className="grid gap-4 px-6 py-6 md:grid-cols-3 sm:px-8">
            {settingsCards.map((card) => (
              <MithoCard key={card.title} surface="customer" interactive="subtle" className="h-full rounded-[1.35rem]">
                <MithoCardContent className="flex h-full flex-col justify-between p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-brand-dark-green">{card.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
                  </div>
                </MithoCardContent>
              </MithoCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

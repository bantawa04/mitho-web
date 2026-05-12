import Link from "next/link"
import { ArrowRight, Bell, Building2, Clock3, MapPin, Settings } from "lucide-react"
import { IntegrationStatus } from "@/components/dashboard/integration-status"
import { MediaPerformance } from "@/components/dashboard/media-performance"
import { ProfileStatus } from "@/components/dashboard/profile-status"
import { ReviewsOverview } from "@/components/dashboard/reviews-overview"
import { SettingsManagement } from "@/components/dashboard/settings-management"
import { TrafficAnalytics } from "@/components/dashboard/traffic-analytics"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import type { ManagedBusiness } from "@/components/dashboard/dashboard-business-data"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/ui/mitho-card"

function DashboardSectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">{eyebrow}</p>
      <h1 className="text-4xl font-semibold leading-tight text-brand-dark-green">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
    </section>
  )
}

export function ReviewsRoutePage() {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Reviews"
        title="See what customers are actually saying."
        description="This page is for reading the latest review mix, spotting recurring signals, and preparing replies without scanning the whole dashboard."
      />
      <ReviewsOverview />
    </div>
  )
}

export function PhotosRoutePage() {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Photos"
        title="Keep your listing visually trustworthy."
        description="Use this section to understand which photos are doing the heavy lifting and what still needs to be uploaded next."
      />
      <MediaPerformance />
    </div>
  )
}

export function AnalyticsRoutePage() {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Analytics"
        title="Track the signals that tell you if the listing is moving."
        description="Keep this page focused on views, visits, and engagement trends instead of mixing those signals into every other operational screen."
      />
      <KeyMetrics />
      <TrafficAnalytics />
    </div>
  )
}

export function BusinessInfoRoutePage({ business }: { business: ManagedBusiness }) {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Business info"
        title="Update the details customers use to trust the listing."
        description="This section keeps core identity details in one place so the business name, location, and setup guidance are easier to maintain."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <MithoCard surface="business" interactive="subtle" className="bg-white">
          <MithoCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-card-title text-foreground">Current listing identity</h2>
                <p className="type-meta">A short read on the public-facing core details.</p>
              </div>
            </div>
          </MithoCardHeader>
          <MithoCardContent>
            <div className="space-y-3">
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Business name</p>
                <p className="mt-2 text-base font-semibold text-foreground">{business.name}</p>
              </div>
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Location</p>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  {business.location}
                </div>
              </div>
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Current need</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use this route for the listing identity layer only. Photos, hours, reviews, and analytics should stay in their own sections now.
                </p>
              </div>
            </div>
          </MithoCardContent>
        </MithoCard>

        <div className="space-y-6">
          <ProfileStatus />
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Editing flow</h2>
                  <p className="type-meta">The full edit form can live here next without competing with the rest of the workspace.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                This route is the right place for the eventual business-info form: name, description, categories, contact details, and map-level edits.
              </p>
            </MithoCardContent>
          </MithoCard>
        </div>
      </div>
    </div>
  )
}

export function HoursRoutePage({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Hours"
        title="Keep opening hours clear before people make the trip."
        description="Hours belong on their own route so they can be updated quickly without digging through broader business settings."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <MithoCard surface="business" interactive="subtle" className="bg-white">
          <MithoCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-card-title text-foreground">Current weekly schedule</h2>
                <p className="type-meta">This dedicated route is ready for the eventual editable hours form.</p>
              </div>
            </div>
          </MithoCardHeader>
          <MithoCardContent>
            <div className="space-y-3">
              {[
                "Sunday — 10:00 AM to 9:00 PM",
                "Monday — 10:00 AM to 9:00 PM",
                "Tuesday — 10:00 AM to 9:00 PM",
                "Wednesday — 10:00 AM to 9:00 PM",
                "Thursday — 10:00 AM to 9:00 PM",
                "Friday — 11:00 AM to 10:00 PM",
                "Saturday — 11:00 AM to 10:00 PM",
              ].map((item) => (
                <div key={item} className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </MithoCardContent>
        </MithoCard>

        <MithoCard surface="business" interactive="subtle" className="bg-white">
          <MithoCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-card-title text-foreground">Why this page matters</h2>
                <p className="type-meta">Hours are one of the fastest trust wins.</p>
              </div>
            </div>
          </MithoCardHeader>
          <MithoCardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              Keep special schedules, lunch gaps, and holiday changes here so the listing stays accurate before people set out.
            </p>
            <MithoButton className="mt-5" asChild>
              <Link href={`/dashboard/businesses/${businessId}/settings`}>
                Open settings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MithoButton>
          </MithoCardContent>
        </MithoCard>
      </div>
    </div>
  )
}

export function SettingsRoutePage({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Settings"
        title="Keep operational preferences and integrations in one place."
        description="This route should hold business-account preferences, notifications, delivery integrations, and deeper management links without crowding the overview."
      />

      <div className="space-y-8">
        <IntegrationStatus />
        <SettingsManagement businessId={businessId} />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Bell, Building2, Mail, MapPin, Settings } from "lucide-react"
import { IntegrationStatus } from "@/components/dashboard/integration-status"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import { MediaPerformance } from "@/components/dashboard/media-performance"
import { ProfileStatus } from "@/components/dashboard/profile-status"
import { ReviewsOverview } from "@/components/dashboard/reviews-overview"
import { SettingsManagement } from "@/components/dashboard/settings-management"
import { TrafficAnalytics } from "@/components/dashboard/traffic-analytics"
import type { ManagedBusiness } from "@/components/dashboard/dashboard-business-data"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/ui/mitho-card"
import { ToggleSwitch } from "@/components/ui/mitho-toggle-switch"

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
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Business name</p>
                <p className="mt-2 text-base font-semibold text-foreground">{business.name}</p>
              </div>
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Location</p>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  {business.location}
                </div>
              </div>
              <div className="rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4">
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
                  <p className="type-meta">The full edit form can deepen here without competing with the rest of the workspace.</p>
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

type HoursRow = {
  day: string
  opensAt: string
  closesAt: string
  closed: boolean
}

const INITIAL_HOURS: HoursRow[] = [
  { day: "Sunday", opensAt: "10:00", closesAt: "21:00", closed: false },
  { day: "Monday", opensAt: "10:00", closesAt: "21:00", closed: false },
  { day: "Tuesday", opensAt: "10:00", closesAt: "21:00", closed: false },
  { day: "Wednesday", opensAt: "10:00", closesAt: "21:00", closed: false },
  { day: "Thursday", opensAt: "10:00", closesAt: "21:00", closed: false },
  { day: "Friday", opensAt: "11:00", closesAt: "22:00", closed: false },
  { day: "Saturday", opensAt: "11:00", closesAt: "22:00", closed: false },
]

export function HoursRoutePage() {
  const [hours, setHours] = useState(INITIAL_HOURS)
  const [saved, setSaved] = useState(false)

  function updateHours(index: number, field: keyof HoursRow, value: string | boolean) {
    setSaved(false)
    setHours((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Hours"
        title="Keep opening hours clear before people make the trip."
        description="Hours belong on their own route so they can be updated quickly without digging through broader business settings."
      />

      <MithoCard surface="business" interactive="subtle" className="bg-white">
        <MithoCardHeader>
          <div>
            <h2 className="type-card-title text-foreground">Weekly schedule</h2>
            <p className="type-meta">Update open and close times here, then save the full schedule in one pass.</p>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="divide-y divide-brand-deep-green/10">
            {hours.map((item, index) => (
              <div
                key={item.day}
                className="grid gap-4 px-2 py-5 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_120px] md:px-4"
              >
                <div className="flex items-center">
                  <p className="text-sm font-semibold text-foreground">{item.day}</p>
                </div>

                <label className="space-y-2">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Opens</span>
                  <input
                    type="time"
                    value={item.opensAt}
                    onChange={(event) => updateHours(index, "opensAt", event.target.value)}
                    disabled={item.closed}
                    className="w-full rounded-[0.9rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Closes</span>
                  <input
                    type="time"
                    value={item.closesAt}
                    onChange={(event) => updateHours(index, "closesAt", event.target.value)}
                    disabled={item.closed}
                    className="w-full rounded-[0.9rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>

                <div className="flex items-end md:justify-end">
                  <ToggleSwitch
                    checked={item.closed}
                    onCheckedChange={(checked) => updateHours(index, "closed", checked)}
                    label="Closed"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="flex items-center gap-3">
              {saved ? <span className="text-sm font-medium text-success">Hours updated in this mock flow.</span> : null}
              <MithoButton size="sm" onClick={() => setSaved(true)}>
                Save
              </MithoButton>
            </div>
          </div>
        </MithoCardContent>
      </MithoCard>
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

        <section id="notification-preferences" className="py-8">
          <p className="type-eyebrow mb-3 text-brand-deep-green/70">Notifications</p>
          <h2 className="type-section-title mb-6 text-foreground">Notification preferences</h2>
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="type-card-title text-foreground">Alerts that matter</h3>
                  <p className="type-meta">Choose which updates should reach the owner or manager.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="space-y-3">
                {[
                  "New reviews and reply reminders",
                  "Listing changes that need approval",
                  "Photo moderation updates",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deep-green/8 text-brand-deep-green">
                        <Bell className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{item}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Enabled</span>
                  </div>
                ))}
              </div>
            </MithoCardContent>
          </MithoCard>
        </section>
      </div>
    </div>
  )
}

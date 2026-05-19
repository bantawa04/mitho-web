"use client"

import { useState } from "react"
import { Bell, Building2, Globe, Mail, MapPin, Phone, Settings, Sparkles } from "lucide-react"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import { MediaPerformance } from "@/components/dashboard/media-performance"
import { ReviewsOverview } from "@/components/dashboard/reviews-overview"
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
  const initialForm = (() => {
    const [neighborhood = business.location, city = "Kathmandu"] = business.location.split(",").map((part) => part.trim())

    return {
      name: business.name,
      description:
        business.id === "the-himalayan-kitchen"
          ? "A warm neighborhood kitchen for Himalayan comfort dishes, familiar momo plates, and group-friendly dinners."
          : "Update the short description so guests understand the business quickly before they visit.",
      primaryCategory: business.id.includes("momo") ? "Momo spot" : "Restaurant",
      neighborhood,
      city,
      fullAddress: `${business.location}, Nepal`,
      phone: "+977 9800000000",
      website: "https://mithocha.example/business",
      tags: business.id.includes("himalayan") ? "Momo, Tibetan, Family dinner" : "Local favorites, Casual dining",
    }
  })()
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)

  function updateForm<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setSaved(false)
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Business info"
        title="Edit the details customers use to trust the listing."
        description="Keep the business identity, contact details, and public-facing copy accurate here so the listing stays reliable without touching reviews, photos, or analytics."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <MithoCard surface="business" interactive="subtle" className="bg-white">
          <MithoCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-card-title text-foreground">Business profile form</h2>
                <p className="type-meta">Update what guests see first when they open the listing.</p>
              </div>
            </div>
          </MithoCardHeader>
          <MithoCardContent>
            <div className="space-y-8">
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Listing basics</h3>
                  <p className="mt-1 text-sm text-muted-foreground">These details shape the first impression in search, collection previews, and the business page.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Business name</span>
                    <input
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Short description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                      rows={4}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Primary category</span>
                    <select
                      value={form.primaryCategory}
                      onChange={(event) => updateForm("primaryCategory", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    >
                      {["Restaurant", "Cafe", "Bakery", "Momo spot", "Street food", "Bar"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Taste tags</span>
                    <input
                      value={form.tags}
                      onChange={(event) => updateForm("tags", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-4 border-t border-brand-deep-green/10 pt-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Contact & location</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Keep visit details accurate so the listing stays easy to trust and act on.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Neighborhood</span>
                    <input
                      value={form.neighborhood}
                      onChange={(event) => updateForm("neighborhood", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">City</span>
                    <input
                      value={form.city}
                      onChange={(event) => updateForm("city", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Full address</span>
                    <input
                      value={form.fullAddress}
                      onChange={(event) => updateForm("fullAddress", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Phone</span>
                    <input
                      value={form.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Website</span>
                    <input
                      value={form.website}
                      onChange={(event) => updateForm("website", event.target.value)}
                      className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3 border-t border-brand-deep-green/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
                {saved ? <span className="text-sm font-medium text-success">Business info updated in this mock flow.</span> : null}
                <MithoButton
                  variant="outline-secondary"
                  onClick={() => {
                    setForm(initialForm)
                    setSaved(false)
                  }}
                >
                  Discard draft
                </MithoButton>
                <MithoButton onClick={() => setSaved(true)}>Save changes</MithoButton>
              </div>
            </div>
          </MithoCardContent>
        </MithoCard>

        <div className="space-y-6">
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Live preview</h2>
                  <p className="type-meta">The public-facing essentials update here as you edit the form.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="space-y-5 border-t border-brand-deep-green/10 pt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-deep-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green">
                    {form.primaryCategory}
                  </span>
                  <span className="rounded-full bg-brand-soft-beige px-3 py-1 text-xs font-semibold text-brand-orange">
                    {business.status === "active" ? "Active listing" : "Needs review"}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold leading-tight text-brand-dark-green">{form.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{form.description}</p>
                </div>
                <div className="space-y-3 border-t border-brand-deep-green/10 pt-4 text-sm text-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>{form.fullAddress}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>{form.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span className="break-all">{form.website}</span>
                  </div>
                </div>
              </div>
            </MithoCardContent>
          </MithoCard>

          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Editing guidance</h2>
                  <p className="type-meta">Keep the listing crisp and trustworthy before you publish changes.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Use one clear sentence that explains why someone should trust this place.</li>
                <li>Keep the primary category broad enough for search and the tags specific enough for local flavor.</li>
                <li>Only use the settings, photos, and hours routes for their own tasks so this form stays focused.</li>
              </ul>
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
  const [notificationPreferences, setNotificationPreferences] = useState([
    {
      id: "new-reviews",
      title: "New reviews",
      description: "Get notified when a new review is posted so you can respond quickly.",
      enabled: true,
    },
    {
      id: "reply-reminders",
      title: "Reply reminders",
      description: "Receive reminders for reviews that have not been answered yet.",
      enabled: true,
    },
  ])
  const [operationalPreferences, setOperationalPreferences] = useState([
    {
      id: "pause-listing",
      title: "Temporarily pause the public listing",
      description: "Hide the listing from discovery while keeping the workspace available to the team.",
      enabled: false,
    },
  ])
  const [settingsSaved, setSettingsSaved] = useState(false)

  const updateNotificationPreference = (id: string, enabled: boolean) => {
    setSettingsSaved(false)
    setNotificationPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    )
  }

  const updateOperationalPreference = (id: string, enabled: boolean) => {
    setSettingsSaved(false)
    setOperationalPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardSectionIntro
        eyebrow="Settings"
        title="Keep operational preferences in one place."
        description="Use this page for business-account controls and notification choices without cluttering the main workspace."
      />

      <div className="space-y-8">
        <section className="py-8">
          <p className="type-eyebrow mb-3 text-brand-deep-green/70">Workspace</p>
          <h2 className="type-section-title mb-6 text-foreground">Operational controls</h2>
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="type-card-title text-foreground">How the workspace behaves</h3>
                  <p className="type-meta">Control the business tools owners and managers rely on most often.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="space-y-3">
                {operationalPreferences.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p>
                    </div>
                    <ToggleSwitch
                      checked={item.enabled}
                      onCheckedChange={(checked) => updateOperationalPreference(item.id, checked)}
                      aria-label={item.title}
                    />
                  </div>
                ))}
              </div>
            </MithoCardContent>
          </MithoCard>
        </section>

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
                {notificationPreferences.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deep-green/8 text-brand-deep-green">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={item.enabled}
                      onCheckedChange={(checked) => updateNotificationPreference(item.id, checked)}
                      aria-label={item.title}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-brand-deep-green/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
                {settingsSaved ? <span className="text-sm font-medium text-success">Settings updated in this mock flow.</span> : null}
                <MithoButton onClick={() => setSettingsSaved(true)}>Save settings</MithoButton>
              </div>
            </MithoCardContent>
          </MithoCard>
        </section>
      </div>
    </div>
  )
}

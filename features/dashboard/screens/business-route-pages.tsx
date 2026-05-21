"use client"

import { useState } from "react"
import { Bell, Building2, CircleAlert, Clock3, Globe, Mail, MapPin, Phone, Settings, ShieldAlert, Sparkles, Trash2 } from "lucide-react"
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
import { KeyMetrics } from "@/features/dashboard/components/key-metrics"
import { MediaPerformance } from "@/features/dashboard/components/media-performance"
import { ReviewsOverview } from "@/features/dashboard/components/reviews-overview"
import { TrafficAnalytics } from "@/features/dashboard/components/traffic-analytics"
import type { BusinessLifecycleStatus, ManagedBusiness } from "@/features/dashboard/data/dashboard-business-data"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/mitho/mitho-card"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"

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

function lifecycleStatusLabel(status: BusinessLifecycleStatus) {
  switch (status) {
    case "active":
      return "Active"
    case "temporarily_closed":
      return "Temporarily closed"
    case "permanently_closed":
      return "Permanently closed"
    case "unclaimed":
      return "Unclaimed"
    case "archived":
      return "Archived"
    case "draft":
      return "Draft"
    case "suspended":
      return "Suspended"
  }
}

function lifecycleStatusTone(status: BusinessLifecycleStatus) {
  switch (status) {
    case "active":
      return "bg-success/12 text-success"
    case "temporarily_closed":
      return "bg-brand-soft-beige text-brand-orange"
    case "permanently_closed":
      return "bg-muted text-muted-foreground"
    case "unclaimed":
      return "bg-brand-deep-green/10 text-brand-deep-green"
    case "archived":
    case "draft":
    case "suspended":
      return "bg-muted text-muted-foreground"
  }
}

function lifecycleStatusDescription(status: BusinessLifecycleStatus) {
  switch (status) {
    case "active":
      return "The listing is visible as normal and can keep receiving customer traffic, reviews, and routine updates."
    case "temporarily_closed":
      return "The listing remains on Mitho but will clearly show that the business is temporarily closed until you reopen it."
    case "permanently_closed":
      return "The listing stays public as historical place data and is marked permanently closed for customers."
    case "unclaimed":
      return "This listing exists publicly but is not actively controlled by an owner account right now."
    case "archived":
      return "This workspace is archived internally and should not be treated as an active operating business."
    case "draft":
      return "This listing has not been fully published yet and can still change more aggressively."
    case "suspended":
      return "This listing is under platform or policy restriction and should be handled through support/admin review."
  }
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
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lifecycleStatusTone(business.lifecycleStatus ?? "active")}`}>
                    {lifecycleStatusLabel(business.lifecycleStatus ?? "active")}
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

export function SettingsRoutePage({ business }: { business: ManagedBusiness }) {
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
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [lifecycleStatus, setLifecycleStatus] = useState<BusinessLifecycleStatus>(business.lifecycleStatus ?? "active")
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false)
  const [removalReason, setRemovalReason] = useState("duplicate")
  const [removalNote, setRemovalNote] = useState("")
  const [removalRequested, setRemovalRequested] = useState(false)

  const updateNotificationPreference = (id: string, enabled: boolean) => {
    setSettingsSaved(false)
    setNotificationPreferences((current) =>
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

        <section className="py-8">
          <p className="type-eyebrow mb-3 text-brand-deep-green/70">Lifecycle</p>
          <h2 className="type-section-title mb-6 text-foreground">Business status & removal</h2>
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="type-card-title text-foreground">Current business status</h3>
                  <p className="type-meta">Use lifecycle controls here instead of deleting or hiding a published listing directly.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="rounded-[1.2rem] border border-brand-deep-green/10 bg-surface-business-inset px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${lifecycleStatusTone(lifecycleStatus)}`}>
                      {lifecycleStatusLabel(lifecycleStatus)}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{lifecycleStatusDescription(lifecycleStatus)}</p>
                  </div>
                  {removalRequested ? (
                    <span className="rounded-full bg-brand-soft-beige px-3 py-1 text-xs font-semibold text-brand-orange">
                      Removal requested
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {lifecycleStatus === "active" ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="w-full rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4 text-left transition-colors hover:border-brand-deep-green/18"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                              <Clock3 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">Temporarily close business</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Keep the listing public, but clearly show customers that the business is temporarily closed until you reopen it.
                              </p>
                            </div>
                          </div>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Temporarily close this business?</AlertDialogTitle>
                          <AlertDialogDescription>
                            The listing will stay visible on Mitho and customers will see that the business is temporarily closed. You can reopen it later from this same settings page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setLifecycleStatus("temporarily_closed")
                              setSettingsSaved(true)
                            }}
                          >
                            Close temporarily
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="w-full rounded-[1rem] border border-danger/15 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/25 hover:bg-danger/8"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
                              <ShieldAlert className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">Mark permanently closed</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Use this when the business is no longer operating. The public listing remains visible as historical place data.
                              </p>
                            </div>
                          </div>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mark this business permanently closed?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Customers will continue to see the listing, but it will be labeled permanently closed. This is more serious than a temporary closure and should only be used when the business is no longer operating.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep active</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-danger text-danger-foreground hover:bg-danger/90"
                            onClick={() => {
                              setLifecycleStatus("permanently_closed")
                              setSettingsSaved(true)
                            }}
                          >
                            Mark permanently closed
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : null}

                {lifecycleStatus === "temporarily_closed" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setLifecycleStatus("active")
                        setSettingsSaved(true)
                      }}
                      className="w-full rounded-[1rem] border border-success/20 bg-success/5 px-4 py-4 text-left transition-colors hover:border-success/30 hover:bg-success/8"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">Reopen business</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Remove the temporary closure label and return the listing to its normal active state.
                          </p>
                        </div>
                      </div>
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="w-full rounded-[1rem] border border-danger/15 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/25 hover:bg-danger/8"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
                              <ShieldAlert className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">Mark permanently closed</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Escalate from temporary closure when the business will not reopen.
                              </p>
                            </div>
                          </div>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Convert this to permanently closed?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will keep the listing public as a permanently closed business record instead of a reversible temporary closure.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep temporarily closed</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-danger text-danger-foreground hover:bg-danger/90"
                            onClick={() => {
                              setLifecycleStatus("permanently_closed")
                              setSettingsSaved(true)
                            }}
                          >
                            Mark permanently closed
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : null}

                {lifecycleStatus === "permanently_closed" ? (
                  <div className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <CircleAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Permanent closure is now the public-facing status.</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          If this was set by mistake, handle the correction through support or a future admin workflow rather than ordinary day-to-day settings.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-brand-deep-green/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-danger/75">Removal request</p>
                  <Dialog open={isRemovalDialogOpen} onOpenChange={setIsRemovalDialogOpen}>
                    <button
                      type="button"
                      onClick={() => setIsRemovalDialogOpen(true)}
                      className="mt-3 w-full rounded-[1rem] border border-danger/20 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/30 hover:bg-danger/8"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
                          <Trash2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">Request listing removal</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Use this for duplicates, incorrect listings, or other cases that should be reviewed instead of deleted immediately.
                          </p>
                        </div>
                      </div>
                    </button>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Request listing removal</DialogTitle>
                        <DialogDescription>
                          Published businesses are not hard-deleted directly from the dashboard. Submit the reason here so the removal can be reviewed safely.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <label className="space-y-2">
                          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Reason</span>
                          <select
                            value={removalReason}
                            onChange={(event) => setRemovalReason(event.target.value)}
                            className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                          >
                            <option value="duplicate">Duplicate listing</option>
                            <option value="incorrect">Incorrect or mistaken listing</option>
                            <option value="draft-mistake">Created by mistake before proper setup</option>
                            <option value="other">Other review-needed reason</option>
                          </select>
                        </label>
                        <label className="space-y-2">
                          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/58">Optional note</span>
                          <textarea
                            rows={4}
                            value={removalNote}
                            onChange={(event) => setRemovalNote(event.target.value)}
                            placeholder="Share any context that will help support or admin review the request."
                            className="w-full rounded-[1rem] border border-brand-deep-green/12 bg-surface-business-inset px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                          />
                        </label>
                        <div className="rounded-[1rem] border border-brand-deep-green/10 bg-surface-business-inset px-4 py-4 text-sm leading-6 text-muted-foreground">
                          Removal requests are meant for safe review workflows. The public listing may stay visible until the request is reviewed and approved.
                        </div>
                      </div>
                      <DialogFooter>
                        <MithoButton variant="outline-secondary" onClick={() => setIsRemovalDialogOpen(false)}>
                          Cancel
                        </MithoButton>
                        <MithoButton
                          variant="danger"
                          onClick={() => {
                            setRemovalRequested(true)
                            setSettingsSaved(true)
                            setIsRemovalDialogOpen(false)
                          }}
                        >
                          Submit removal request
                        </MithoButton>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </MithoCardContent>
          </MithoCard>
        </section>
      </div>
    </div>
  )
}

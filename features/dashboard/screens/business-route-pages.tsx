"use client"

import { useState } from "react"
import { Bell, CircleAlert, Clock3, Mail, Settings, ShieldAlert, Trash2 } from "lucide-react"
import { useBusinessHours, useReplaceBusinessHours } from "@/hooks/use-businesses"
import type { BusinessHour, ReplaceHoursPayload } from "@/types/business"
import { BusinessEditForm } from "@/features/dashboard/screens/business-edit-form"
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
import { BusinessGallery } from "@/features/dashboard/components/business-gallery"
import { KeyMetrics } from "@/features/dashboard/components/key-metrics"
import { ReviewsOverview } from "@/features/dashboard/components/reviews-overview"
import { TrafficAnalytics } from "@/features/dashboard/components/traffic-analytics"
import type { BusinessLifecycleStatus } from "@/features/dashboard/data/dashboard-business-data"
import {
  deriveBusinessLifecycleStatus,
  getBusinessLifecyclePresentation,
} from "@/features/dashboard/utils/dashboard-business-utils"
import { useBusinessDetail, useMyBusiness } from "@/hooks/use-businesses"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/mitho/mitho-card"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"

export function ReviewsRoutePage() {
  return (
    <div className="space-y-6 pb-12">
      <ReviewsOverview />
    </div>
  )
}

export function PhotosRoutePage({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6 pb-12">
      <BusinessGallery businessId={businessId} />
    </div>
  )
}

export function AnalyticsRoutePage() {
  return (
    <div className="space-y-6 pb-12">
      <KeyMetrics />
      <TrafficAnalytics />
    </div>
  )
}

export function BusinessInfoRoutePage({ businessId }: { businessId: string }) {
  const { data: business, isLoading } = useBusinessDetail(businessId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Unable to load business details.</p>
      </div>
    )
  }

  return <BusinessEditForm businessId={business.id} business={business} />
}

type HoursFormRow = {
  dayOfWeek: number
  dayName: string
  opensAt: string
  closesAt: string
  isClosed: boolean
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function buildFormRows(apiData: BusinessHour[]): HoursFormRow[] {
  const byDay = new Map(apiData.map((h) => [h.dayOfWeek, h]))
  return DAY_NAMES.map((dayName, dayOfWeek) => {
    const existing = byDay.get(dayOfWeek)
    if (existing) {
      return {
        dayOfWeek,
        dayName,
        opensAt: existing.openTime ?? "10:00",
        closesAt: existing.closeTime ?? "21:00",
        isClosed: existing.isClosed,
      }
    }
    return { dayOfWeek, dayName, opensAt: "10:00", closesAt: "21:00", isClosed: false }
  })
}

function HoursForm({ businessId, initialHours }: { businessId: string; initialHours: BusinessHour[] }) {
  const [rows, setRows] = useState<HoursFormRow[]>(() => buildFormRows(initialHours))
  const { mutate: replaceHours, isPending, isError, isSuccess, reset } = useReplaceBusinessHours(businessId)

  function updateRow(index: number, update: Partial<HoursFormRow>) {
    if (isSuccess || isError) reset()
    setRows((current) => current.map((item, i) => (i === index ? { ...item, ...update } : item)))
  }

  function handleSave() {
    const payload: ReplaceHoursPayload = {
      hours: rows.map((row) => ({
        dayOfWeek: row.dayOfWeek,
        isClosed: row.isClosed,
        openTime: row.isClosed ? undefined : row.opensAt,
        closeTime: row.isClosed ? undefined : row.closesAt,
      })),
    }
    replaceHours(payload)
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="type-section-title text-foreground">Weekly schedule</h2>
        <p className="type-meta mt-1">Update open and close times here, then save the full schedule in one pass.</p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {rows.map((item, index) => (
          <div
            key={item.dayOfWeek}
            className="grid gap-4 px-4 py-3 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_120px] md:px-6"
          >
            <div className="flex items-center">
              <p className="text-sm font-semibold text-foreground">{item.dayName}</p>
            </div>

            <label className="space-y-2">
              <span className="block text-xs font-semibold text-muted-foreground">Opens</span>
              <input
                type="time"
                value={item.opensAt}
                onChange={(e) => updateRow(index, { opensAt: e.target.value })}
                disabled={item.isClosed || isPending}
                className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-xs font-semibold text-muted-foreground">Closes</span>
              <input
                type="time"
                value={item.closesAt}
                onChange={(e) => updateRow(index, { closesAt: e.target.value })}
                disabled={item.isClosed || isPending}
                className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <div className="flex items-end md:justify-end">
              <ToggleSwitch
                checked={item.isClosed}
                onCheckedChange={(checked) => updateRow(index, { isClosed: checked })}
                label="Closed"
                disabled={isPending}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {isSuccess ? <span className="text-sm font-medium text-success">Hours saved.</span> : null}
        {isError ? <span className="text-sm font-medium text-danger">Something went wrong. Please try again.</span> : null}
        <MithoButton size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save hours"}
        </MithoButton>
      </div>
    </section>
  )
}

export function HoursRoutePage({ businessId }: { businessId: string }) {
  const { data, isLoading, dataUpdatedAt } = useBusinessHours(businessId)

  return (
    <div className="space-y-6 pb-12">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
        </div>
      ) : (
        <HoursForm businessId={businessId} initialHours={data ?? []} key={`${businessId}-${dataUpdatedAt}`} />
      )}
    </div>
  )
}

function SettingsContent({ initialLifecycleStatus }: { initialLifecycleStatus: BusinessLifecycleStatus }) {
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
  const [lifecycleStatus, setLifecycleStatus] = useState<BusinessLifecycleStatus>(initialLifecycleStatus)
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = useState(false)
  const [removalReason, setRemovalReason] = useState("duplicate")
  const [removalNote, setRemovalNote] = useState("")
  const [removalRequested, setRemovalRequested] = useState(false)
  const lifecyclePresentation = getBusinessLifecyclePresentation(lifecycleStatus)

  const updateNotificationPreference = (id: string, enabled: boolean) => {
    setSettingsSaved(false)
    setNotificationPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-6">
        <section id="notification-preferences">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="type-section-title text-foreground">Notification preferences</h2>
              <p className="type-meta mt-1">Choose which updates should reach the owner or manager.</p>
            </div>
          </div>

          <div className="space-y-2">
            {notificationPreferences.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
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

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {settingsSaved ? <span className="text-sm font-medium text-success">Settings updated in this mock flow.</span> : null}
            <MithoButton onClick={() => setSettingsSaved(true)}>Save settings</MithoButton>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="type-section-title text-foreground">Business status & removal</h2>
              <p className="type-meta mt-1">Use lifecycle controls here instead of deleting or hiding a published listing directly.</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-business-inset px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${lifecyclePresentation.tone}`}>
                  {lifecyclePresentation.label}
                </span>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{lifecyclePresentation.description}</p>
              </div>
              {removalRequested ? (
                <span className="rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  Removal requested
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {lifecycleStatus === "active" ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border bg-white px-4 py-4 text-left transition-colors hover:border-brand-deep-green/18"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
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
                      className="w-full rounded-lg border border-danger/15 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/25 hover:bg-danger/8"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
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
                  className="w-full rounded-lg border border-success/20 bg-success/5 px-4 py-4 text-left transition-colors hover:border-success/30 hover:bg-success/8"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
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
                      className="w-full rounded-lg border border-danger/15 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/25 hover:bg-danger/8"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
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
              <div className="rounded-lg border border-border bg-surface-business-inset px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
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

            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-danger/75">Removal request</p>
              <Dialog open={isRemovalDialogOpen} onOpenChange={setIsRemovalDialogOpen}>
                <button
                  type="button"
                  onClick={() => setIsRemovalDialogOpen(true)}
                  className="mt-3 w-full rounded-lg border border-danger/20 bg-danger/5 px-4 py-4 text-left transition-colors hover:border-danger/30 hover:bg-danger/8"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
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
                      <span className="block text-xs font-semibold text-muted-foreground">Reason</span>
                      <select
                        value={removalReason}
                        onChange={(event) => setRemovalReason(event.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="duplicate">Duplicate listing</option>
                        <option value="incorrect">Incorrect or mistaken listing</option>
                        <option value="draft-mistake">Created by mistake before proper setup</option>
                        <option value="other">Other review-needed reason</option>
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs font-semibold text-muted-foreground">Optional note</span>
                      <textarea
                        rows={4}
                        value={removalNote}
                        onChange={(event) => setRemovalNote(event.target.value)}
                        placeholder="Share any context that will help support or admin review the request."
                        className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <div className="rounded-lg border border-border bg-surface-business-inset px-4 py-4 text-sm leading-6 text-muted-foreground">
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
        </section>
      </div>
    </div>
  )
}

export function SettingsRoutePage({ businessId }: { businessId: string }) {
  const { entry, isLoading } = useMyBusiness(businessId)

  if (isLoading || !entry) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
      </div>
    )
  }

  return <SettingsContent initialLifecycleStatus={deriveBusinessLifecycleStatus(entry)} />
}

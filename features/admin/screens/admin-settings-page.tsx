"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import { mockAdminSettingsProfile, type AdminSettingsProfile } from "@/features/admin/data/admin-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const notificationFieldLabels: Record<keyof AdminSettingsProfile["notifications"], { title: string; description: string }> = {
  newBusinessSignup: {
    title: "New business signup",
    description: "Get notified when a new business signs up and needs admin review or onboarding.",
  },
  claimRequest: {
    title: "Claim request",
    description: "Get notified when a business owner submits a new ownership claim for review.",
  },
  newReview: {
    title: "New review",
    description: "Receive an alert whenever a fresh customer review lands on the platform.",
  },
}

export function AdminSettingsPage() {
  const [savedProfile, setSavedProfile] = useState(mockAdminSettingsProfile)
  const [draftProfile, setDraftProfile] = useState(mockAdminSettingsProfile)
  const [hasSaved, setHasSaved] = useState(false)

  const isDirty = useMemo(() => JSON.stringify(savedProfile) !== JSON.stringify(draftProfile), [draftProfile, savedProfile])

  function updateAddressField(field: keyof AdminSettingsProfile["address"], value: string) {
    setHasSaved(false)
    setDraftProfile((current) => ({
      ...current,
      address: {
        ...current.address,
        [field]: value,
      },
    }))
  }

  function handleSave() {
    setSavedProfile(draftProfile)
    setHasSaved(true)
  }

  function handleDiscard() {
    setDraftProfile(savedProfile)
    setHasSaved(false)
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Account settings</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Account settings</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Keep your internal operator details current and choose which admin notifications should reach you.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.9rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]">
        <div className="space-y-6 p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</span>
              <Input
                value={draftProfile.name}
                onChange={(event) => {
                  setHasSaved(false)
                  setDraftProfile((current) => ({ ...current, name: event.target.value }))
                }}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Email</span>
              <Input
                value={draftProfile.email}
                disabled
                className="h-11 rounded-xl border-brand-deep-green/10 bg-muted/35 text-muted-foreground shadow-none"
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Address line</span>
              <Input
                value={draftProfile.address.addressLine}
                onChange={(event) => updateAddressField("addressLine", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Area / locality</span>
              <Input
                value={draftProfile.address.area}
                onChange={(event) => updateAddressField("area", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">City</span>
              <Input
                value={draftProfile.address.city}
                onChange={(event) => updateAddressField("city", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">State / province</span>
              <Input
                value={draftProfile.address.state}
                onChange={(event) => updateAddressField("state", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Country</span>
              <Input
                value={draftProfile.address.country}
                onChange={(event) => updateAddressField("country", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Mobile number</span>
              <Input
                value={draftProfile.mobileNumber}
                onChange={(event) => {
                  setHasSaved(false)
                  setDraftProfile((current) => ({ ...current, mobileNumber: event.target.value }))
                }}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
          </div>

          <div className="space-y-4 border-t border-brand-deep-green/10 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-dark-green">Notification settings</p>
              <p className="text-sm text-muted-foreground">Choose how internal moderation, business, and digest alerts should reach you.</p>
            </div>

            <div className="divide-y divide-brand-deep-green/10 rounded-2xl border border-brand-deep-green/10 px-4">
              {(Object.keys(notificationFieldLabels) as Array<keyof AdminSettingsProfile["notifications"]>).map((field) => (
                <label key={field} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-brand-dark-green">{notificationFieldLabels[field].title}</p>
                    <p className="text-xs text-muted-foreground">{notificationFieldLabels[field].description}</p>
                  </div>
                  <Switch
                    checked={draftProfile.notifications[field]}
                    onCheckedChange={(checked) => {
                      setHasSaved(false)
                      setDraftProfile((current) => ({
                        ...current,
                        notifications: {
                          ...current.notifications,
                          [field]: checked,
                        },
                      }))
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-brand-deep-green/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[1.25rem] text-sm text-muted-foreground">
              {hasSaved && !isDirty ? "Changes saved for this admin profile." : isDirty ? "Unsaved changes" : ""}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
                onClick={handleDiscard}
                disabled={!isDirty}
              >
                Discard changes
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

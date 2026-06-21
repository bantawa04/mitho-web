"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { AdminSettings, UpdateAdminSettingsPayload } from "@/lib/api/admin-settings"
import { useAdminSettings, useUpdateAdminSettings } from "@/hooks/use-admin-settings"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const emptyProfile: AdminSettings = {
  name: "",
  email: "",
  address: {
    addressLine: "",
    area: "",
    city: "",
    state: "",
    country: "",
  },
  mobileNumber: "",
  notifications: {
    newBusinessSignup: false,
    claimRequest: false,
    newReview: false,
  },
}

const notificationFieldLabels: Record<keyof AdminSettings["notifications"], { title: string; description: string }> = {
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
  const { toast } = useToast()
  const { data: settings, isLoading } = useAdminSettings()
  const updateSettings = useUpdateAdminSettings()

  const savedProfile = settings ?? emptyProfile
  const [draftProfile, setDraftProfile] = useState<AdminSettings>(emptyProfile)
  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setDraftProfile(settings)
    }
  }, [settings])

  const isDirty = useMemo(() => JSON.stringify(savedProfile) !== JSON.stringify(draftProfile), [draftProfile, savedProfile])

  function updateAddressField(field: keyof AdminSettings["address"], value: string) {
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
    const payload: UpdateAdminSettingsPayload = {
      name: draftProfile.name,
      address: draftProfile.address,
      mobileNumber: draftProfile.mobileNumber,
      notifications: draftProfile.notifications,
    }

    updateSettings.mutate(payload, {
      onSuccess: () => {
        setHasSaved(true)
        toast({ title: "Settings saved", description: "Your admin account settings have been updated." })
      },
      onError: () => {
        toast({
          title: "Could not save settings",
          description: "Something went wrong while saving. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  function handleDiscard() {
    setDraftProfile(savedProfile)
    setHasSaved(false)
  }

  if (isLoading) {
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

        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="space-y-6 p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-11 animate-pulse rounded-xl bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
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

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="space-y-6 p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Name</span>
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
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <Input
                value={draftProfile.email}
                disabled
                className="h-11 rounded-xl border-brand-deep-green/10 bg-muted/35 text-muted-foreground shadow-none"
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs font-medium text-muted-foreground">Address line</span>
              <Input
                value={draftProfile.address.addressLine}
                onChange={(event) => updateAddressField("addressLine", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Area / locality</span>
              <Input
                value={draftProfile.address.area}
                onChange={(event) => updateAddressField("area", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">City</span>
              <Input
                value={draftProfile.address.city}
                onChange={(event) => updateAddressField("city", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">State / province</span>
              <Input
                value={draftProfile.address.state}
                onChange={(event) => updateAddressField("state", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Country</span>
              <Input
                value={draftProfile.address.country}
                onChange={(event) => updateAddressField("country", event.target.value)}
                className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Mobile number</span>
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

          <div className="space-y-4 border-t border-border pt-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-dark-green">Notification settings</p>
              <p className="text-sm text-muted-foreground">Choose how internal moderation, business, and digest alerts should reach you.</p>
            </div>

            <div className="divide-y divide-border rounded-2xl border border-border px-4">
              {(Object.keys(notificationFieldLabels) as Array<keyof AdminSettings["notifications"]>).map((field) => (
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

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[1.25rem] text-sm text-muted-foreground">
              {hasSaved && !isDirty ? "Changes saved for this admin profile." : isDirty ? "Unsaved changes" : ""}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-muted"
                onClick={handleDiscard}
                disabled={!isDirty}
              >
                Discard changes
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-brand-dark-green text-white hover:bg-brand-dark-green/92"
                onClick={handleSave}
                disabled={!isDirty || updateSettings.isPending}
              >
                {updateSettings.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

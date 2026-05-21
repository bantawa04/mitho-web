"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronRight, Building2, Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import type { AdminBusinessDetailItem, AdminBusinessStatus } from "@/features/admin/data/admin-data"
import { adminBusinessStatusOptions } from "@/features/admin/data/admin-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AdminBusinessEditForm = {
  name: string
  description: string
  establishmentType: string
  primaryCategory: string
  status: AdminBusinessStatus
  neighborhood: string
  city: string
  fullAddress: string
  phone: string
  email: string
  website: string
}

function buildInitialForm(business: AdminBusinessDetailItem): AdminBusinessEditForm {
  return {
    name: business.name,
    description: business.description,
    establishmentType: business.establishmentType,
    primaryCategory: business.primaryCategory,
    status: business.status,
    neighborhood: business.neighborhood,
    city: business.city,
    fullAddress: business.fullAddress,
    phone: business.phone,
    email: business.email,
    website: business.website,
  }
}

export function AdminBusinessEditPage({ business }: { business: AdminBusinessDetailItem }) {
  const [savedForm, setSavedForm] = useState(() => buildInitialForm(business))
  const [form, setForm] = useState(() => buildInitialForm(business))
  const [hasSaved, setHasSaved] = useState(false)

  const isDirty = useMemo(() => JSON.stringify(savedForm) !== JSON.stringify(form), [form, savedForm])

  function updateForm<K extends keyof AdminBusinessEditForm>(field: K, value: AdminBusinessEditForm[K]) {
    setHasSaved(false)
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    setSavedForm(form)
    setHasSaved(true)
  }

  function handleDiscard() {
    setForm(savedForm)
    setHasSaved(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/businesses" className="transition-colors hover:text-brand-dark-green">
            Businesses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/admin/businesses/${business.slug}`} className="transition-colors hover:text-brand-dark-green">
            {business.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-brand-dark-green">Edit</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Edit business</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Use the admin form to correct core listing details without stepping into the full business-owner workspace.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-dark-green">Core listing details</h2>
              <p className="text-sm text-muted-foreground">Keep the public business identity, contact details, and status accurate.</p>
            </div>
          </div>

          <div className="mt-6 space-y-8 border-t border-brand-deep-green/10 pt-6">
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="admin-business-name">Name</Label>
                  <Input
                    id="admin-business-name"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="admin-business-description">Description</Label>
                  <textarea
                    id="admin-business-description"
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    rows={4}
                    className="w-full rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-3 text-sm leading-6 text-brand-dark-green shadow-none outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Establishment type</Label>
                  <Input
                    value={form.establishmentType}
                    onChange={(event) => updateForm("establishmentType", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary category</Label>
                  <Input
                    value={form.primaryCategory}
                    onChange={(event) => updateForm("primaryCategory", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => updateForm("status", value as AdminBusinessStatus)}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Choose a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminBusinessStatusOptions
                        .filter((status) => status !== "All")
                        .map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t border-brand-deep-green/10 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Neighborhood</Label>
                  <Input
                    value={form.neighborhood}
                    onChange={(event) => updateForm("neighborhood", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(event) => updateForm("city", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Full address</Label>
                  <Input
                    value={form.fullAddress}
                    onChange={(event) => updateForm("fullAddress", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Website</Label>
                  <Input
                    value={form.website}
                    onChange={(event) => updateForm("website", event.target.value)}
                    className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                  />
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-brand-deep-green/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-[1.25rem] text-sm text-muted-foreground">
                {hasSaved && !isDirty ? "Business details updated in this mock admin flow." : isDirty ? "Unsaved changes" : ""}
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

        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-brand-dark-green">Admin context</h2>
                <p className="text-sm text-muted-foreground">Reference data that helps explain why the listing is in its current state.</p>
              </div>
            </div>
            <div className="mt-6 space-y-5 border-t border-brand-deep-green/10 pt-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Claim state</p>
                <p className="text-sm leading-6 text-brand-dark-green">{business.claimStateNote}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Owner</p>
                <p className="text-sm text-brand-dark-green">{business.ownerName}</p>
                <p className="text-sm text-muted-foreground">{business.ownerEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Current lifecycle</p>
                <p className="text-sm text-brand-dark-green">{business.lifecycleStatus}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-dark-green">Current public read</h2>
                  <p className="text-sm text-muted-foreground">A quick summary of how the listing currently reads to customers.</p>
                </div>
              </div>
              <div className="space-y-3 border-t border-brand-deep-green/10 pt-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <span>{form.fullAddress}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <span>{form.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <span>{form.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <span className="break-all">{form.website}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

"use client"

import type { ReactNode } from "react"
import { MapPin } from "lucide-react"
import { AccountMenu } from "@/features/auth/components/account-menu"

interface DashboardHeaderProps {
  businessName: string
  location: string
  actions?: ReactNode
  signedInUser?: {
    name: string
    avatarUrl?: string
    href?: string
  }
}

export function DashboardHeader({ businessName, location, actions, signedInUser }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="type-section-title text-foreground">{businessName}</h1>
            </div>
            <div className="type-meta flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <AccountMenu fallbackUser={signedInUser} className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-brand-deep-green/18 hover:bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

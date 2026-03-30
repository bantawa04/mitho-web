"use client"

import { MapPin, Calendar } from "lucide-react"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"

interface DashboardHeaderProps {
  businessName: string
  location: string
  planType: string
}

export function DashboardHeader({ businessName, location, planType }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-brand-deep-green/10 bg-surface-business/95 backdrop-blur-md shadow-[0_8px_24px_rgba(10,70,53,0.05)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="type-section-title text-foreground">{businessName}</h1>
              <MithoBadge variant="neutral" size="sm">
                {planType}
              </MithoBadge>
            </div>
            <div className="type-meta flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MithoButton
              variant="ghost"
              size="sm"
              leftIcon={<Calendar className="h-4 w-4" />}
              disabled
              className="opacity-50"
            >
              <span className="hidden sm:inline">Last 30 days</span>
              <span className="sm:hidden">30d</span>
            </MithoButton>
            <span className="capsule-cluster text-muted-foreground">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}

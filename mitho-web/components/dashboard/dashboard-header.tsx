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
    <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{businessName}</h1>
              <MithoBadge variant="outline" size="sm">
                {planType}
              </MithoBadge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            <span className="text-xs text-muted-foreground px-2 py-1 bg-brand-soft-beige rounded-lg">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}

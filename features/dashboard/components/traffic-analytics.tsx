"use client"

import { BarChart3, TrendingUp } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"

export function TrafficAnalytics() {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Performance</p>
      <h2 className="type-section-title mb-4 text-foreground">Traffic & engagement</h2>
      <MithoCard surface="business" interactive="none" className="relative overflow-hidden bg-white rounded-lg shadow-sm">
        <MithoCardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="type-card-title text-foreground">Analytics dashboard</h3>
                <p className="type-meta">Views, clicks, and engagement metrics</p>
              </div>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent className="p-4 pt-0">
          <div className="relative flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="type-card-title mb-1 text-foreground">Analytics coming soon</p>
              <p className="type-meta max-w-md">
                Track your business performance with detailed insights on views, clicks, and customer engagement
              </p>
            </div>
            <MithoButton variant="outline-primary" size="sm" disabled>
              Upgrade to Unlock Insights
            </MithoButton>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

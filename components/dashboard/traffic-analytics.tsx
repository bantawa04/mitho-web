"use client"

import { BarChart3, TrendingUp } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

export function TrafficAnalytics() {
  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Performance</p>
      <h2 className="type-section-title mb-6 text-foreground">Traffic & engagement</h2>
      <MithoCard surface="business" interactive="subtle" className="relative overflow-hidden">
        <MithoCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="type-card-title text-foreground">Analytics dashboard</h3>
                <p className="type-meta">Views, clicks, and engagement metrics</p>
              </div>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="surface-business-inset relative flex h-64 flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-brand-deep-green/18 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              <TrendingUp className="h-8 w-8 text-brand-orange" />
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

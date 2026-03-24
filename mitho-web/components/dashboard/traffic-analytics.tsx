"use client"

import { BarChart3, TrendingUp } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

export function TrafficAnalytics() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Traffic & Engagement</h2>
      <MithoCard className="relative overflow-hidden">
        <MithoCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">Views, clicks, and engagement metrics</p>
              </div>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="relative h-64 bg-gradient-to-br from-brand-soft-beige/30 to-brand-orange/5 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-brand-orange" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground mb-1">Analytics Coming Soon</p>
              <p className="text-sm text-muted-foreground max-w-md">
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

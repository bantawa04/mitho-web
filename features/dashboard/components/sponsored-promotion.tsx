"use client"

import { Megaphone, Lock, TrendingUp, Target, Zap } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoBadge } from "@/components/mitho/mitho-badge"

export function SponsoredPromotion() {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Growth</p>
      <h2 className="type-section-title mb-4 text-foreground">Sponsored promotion</h2>
      <MithoCard surface="business" interactive="none" className="relative overflow-hidden rounded-lg border-border shadow-sm">
        <MithoCardHeader className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="type-card-title text-foreground">Promote your business</h3>
                <p className="type-meta">Reach more customers with sponsored listings</p>
              </div>
            </div>
            <MithoBadge variant="info" size="sm">
              Premium Feature
            </MithoBadge>
          </div>
        </MithoCardHeader>
        <MithoCardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="surface-business-inset rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Higher Visibility</h4>
              <p className="text-xs text-muted-foreground">Appear at the top of search results</p>
            </div>

            <div className="surface-business-inset rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Targeted Reach</h4>
              <p className="text-xs text-muted-foreground">Connect with local food lovers</p>
            </div>

            <div className="surface-business-inset rounded-lg p-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Zap className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Detailed Analytics</h4>
              <p className="text-xs text-muted-foreground">Track campaign performance</p>
            </div>
          </div>

          <div className="surface-business-inset relative flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground mb-1">Unlock Premium Analytics</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                See detailed insights on impressions, clicks, and conversions
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <MithoButton variant="primary" size="lg" disabled className="opacity-60 cursor-not-allowed">
              <span className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Boost Visibility
                <MithoBadge variant="muted" size="sm" className="ml-2">
                  Coming Soon
                </MithoBadge>
              </span>
            </MithoButton>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

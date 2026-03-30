"use client"

import { Megaphone, Lock, TrendingUp, Target, Zap } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoBadge } from "@/components/ui/mitho-badge"

export function SponsoredPromotion() {
  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Growth</p>
      <h2 className="type-section-title mb-6 text-foreground">Sponsored promotion</h2>
      <MithoCard surface="business" interactive="subtle" className="relative overflow-hidden border-brand-orange/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <MithoCardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-white shadow-lg">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="type-card-title text-foreground">Promote your business</h3>
                <p className="type-meta">Reach more customers with sponsored listings</p>
              </div>
            </div>
            <MithoBadge variant="promotional" size="sm">
              Premium Feature
            </MithoBadge>
          </div>
        </MithoCardHeader>
        <MithoCardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="surface-business-inset rounded-[1rem] p-4">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-brand-orange" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Higher Visibility</h4>
              <p className="text-xs text-muted-foreground">Appear at the top of search results</p>
            </div>

            <div className="surface-business-inset rounded-[1rem] p-4">
              <div className="w-10 h-10 rounded-lg bg-brand-deep-green/10 flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-brand-deep-green" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Targeted Reach</h4>
              <p className="text-xs text-muted-foreground">Connect with local food lovers</p>
            </div>

            <div className="surface-business-inset rounded-[1rem] p-4">
              <div className="w-10 h-10 rounded-lg bg-brand-light-green/10 flex items-center justify-center mb-3">
                <Zap className="h-5 w-5 text-brand-light-green" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">Detailed Analytics</h4>
              <p className="text-xs text-muted-foreground">Track campaign performance</p>
            </div>
          </div>

          <div className="surface-business-inset relative flex h-48 flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-brand-orange/28 p-6">
            <div className="w-14 h-14 rounded-full bg-brand-soft-beige flex items-center justify-center">
              <Lock className="h-7 w-7 text-brand-orange" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground mb-1">Unlock Premium Analytics</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                See detailed insights on impressions, clicks, and conversions
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
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

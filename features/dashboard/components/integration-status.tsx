"use client"

import { Package, Lock } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/mitho/mitho-card"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"

export function IntegrationStatus() {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Expansion</p>
      <h2 className="type-section-title mb-4 text-foreground">Delivery integrations</h2>
      <MithoCard surface="business" interactive="none" className="rounded-lg shadow-sm">
        <MithoCardHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Food delivery platforms</h3>
              <p className="type-meta">Connect with popular delivery services</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <img src="/foodmandu.jpg" alt="Foodmandu" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">Foodmandu</h4>
                      <MithoBadge variant="moderation" size="sm">
                        Coming Soon
                      </MithoBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">Nepal&apos;s leading food delivery platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <ToggleSwitch disabled />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <img src="/vok-lagyo.jpg" alt="Vok Lagyo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">Vok Lagyo</h4>
                      <MithoBadge variant="moderation" size="sm">
                        Coming Soon
                      </MithoBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">Fast delivery across Kathmandu</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <ToggleSwitch disabled />
                </div>
              </div>
            </div>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

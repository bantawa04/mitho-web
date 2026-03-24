"use client"

import { Package, Lock } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { ToggleSwitch } from "@/components/ui/mitho-toggle-switch"

export function IntegrationStatus() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Integrations</h2>
      <MithoCard>
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Food Delivery Platforms</h3>
              <p className="text-sm text-muted-foreground">Connect with popular delivery services</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border hover:border-brand-orange/30 transition-colors bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <img src="/foodmandu.jpg" alt="Foodmandu" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">Foodmandu</h4>
                      <MithoBadge variant="warning" size="sm">
                        Coming Soon
                      </MithoBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">Nepal's leading food delivery platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <ToggleSwitch disabled />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border hover:border-brand-orange/30 transition-colors bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-brand-deep-green/10 flex items-center justify-center">
                    <img src="/vok-lagyo.jpg" alt="Vok Lagyo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">Vok Lagyo</h4>
                      <MithoBadge variant="warning" size="sm">
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

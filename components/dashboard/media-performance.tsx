"use client"

import { ImageIcon, Video, Upload } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent, MithoCardFooter } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

export function MediaPerformance() {
  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Media</p>
      <h2 className="type-section-title mb-6 text-foreground">Media performance</h2>
      <MithoCard surface="business" interactive="subtle">
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Photos & videos</h3>
              <p className="type-meta">Your media engagement stats</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="taste-spotlight rounded-[1.5rem] border border-brand-orange/18 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-sm text-muted-foreground">Photo Views</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">18 photos uploaded</p>
            </div>

            <div className="surface-business-inset rounded-[1.5rem] border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-deep-green/20 flex items-center justify-center">
                  <Video className="h-6 w-6 text-brand-deep-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">567</p>
                  <p className="text-sm text-muted-foreground">Video Views</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">3 videos uploaded</p>
            </div>
          </div>
        </MithoCardContent>
        <MithoCardFooter>
          <MithoButton
            variant="secondary"
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Upload Media
          </MithoButton>
        </MithoCardFooter>
      </MithoCard>
    </section>
  )
}

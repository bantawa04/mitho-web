import { MithoSection } from "@/components/ui/mitho-section"
import { MithoBadge } from "@/components/ui/mitho-badge"

export function AdSection() {
  return (
    <MithoSection className="bg-brand-soft-beige/30 py-8 md:py-12">
      <div className="space-y-2">
        {/* Sponsored badge - positioned above the card */}
        <div className="flex items-center gap-2">
          <MithoBadge variant="outline-warning" className="text-xs">
            Sponsored
          </MithoBadge>
        </div>

        {/* Ad card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[4/1] md:aspect-[6/1] bg-gradient-to-r from-brand-soft-beige to-brand-fresh-orange/20 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-lg md:text-xl font-semibold text-brand-dark-green mb-2">Your Ad Could Be Here</p>
              <p className="text-sm text-muted-foreground">Reach thousands of food lovers across Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

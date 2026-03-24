import { MithoSection } from "@/components/ui/mitho-section"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"

export function AdSection() {
  return (
    <MithoSection density="compact" className="pt-0">
      <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white/90 p-6 shadow-[0_14px_32px_rgba(10,70,53,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <MithoBadge variant="outline-orange" className="mb-4">
              Partner spotlight
            </MithoBadge>
            <h3 className="text-2xl font-bold text-brand-dark-green">Put your restaurant in front of hungry locals.</h3>
            <p className="mt-2 text-muted-foreground">
              Promoted placements should feel native to the Mitho experience: useful, tasteful, and clearly labeled.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MithoButton variant="outline-secondary">See sample placement</MithoButton>
            <MithoButton>Advertise with Mitho</MithoButton>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

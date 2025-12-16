import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"

export function SponsoredSection() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-3">
        <MithoBadge variant="muted">Sponsored</MithoBadge>
      </div>
      <MithoCard className="overflow-hidden">
        <MithoCardContent className="p-0">
          <div className="relative aspect-[3/1] sm:aspect-[4/1] bg-gradient-to-r from-brand-orange/10 to-brand-deep-green/10">
            <img
              src="/placeholder.svg?height=200&width=800"
              alt="Sponsored advertisement"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Advertisement Space</p>
            </div>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

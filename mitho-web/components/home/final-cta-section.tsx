import { Compass, Store } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

export function FinalCtaSection() {
  return (
    <MithoSection className="bg-white">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-soft-beige via-white to-brand-soft-beige/50 p-8 md:p-12 lg:p-16 text-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-orange/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-deep-green/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark-green mb-4 text-balance">
            Ready to Discover Your Next Favorite Meal?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of food lovers exploring authentic Nepali cuisine. Start your culinary adventure today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MithoButton size="lg" leftIcon={<Compass className="h-5 w-5" />}>
              Explore Places
            </MithoButton>
            <MithoButton variant="secondary" size="lg" leftIcon={<Store className="h-5 w-5" />}>
              Add Your Business
            </MithoButton>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

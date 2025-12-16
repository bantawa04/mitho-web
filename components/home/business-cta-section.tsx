import { Store, Check } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

const benefits = ["Free business listing", "Respond to reviews", "Manage your profile", "Access to analytics"]

export function BusinessCtaSection() {
  return (
    <MithoSection className="bg-gradient-to-r from-brand-orange to-brand-fresh-orange">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
          <Store className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
          Own a Local Gem? Grow Your Presence
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
          Join thousands of local businesses and connect with food lovers in your area. Claim your free listing today.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-white/90">
              <Check className="h-5 w-5 text-white" />
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        <MithoButton size="lg" className="bg-white text-brand-orange hover:bg-brand-soft-beige shadow-lg">
          Claim Your Business
        </MithoButton>
      </div>
    </MithoSection>
  )
}

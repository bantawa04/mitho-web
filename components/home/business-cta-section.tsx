import Link from "next/link"
import { Store, Check } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

const benefits = ["Free business listing", "Respond to reviews", "Manage your profile", "Access to analytics"]

export function BusinessCtaSection() {
  return (
    <MithoSection id="for-business" density="compact">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-brand-deep-green/10 bg-surface-warm p-8">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-brand-orange text-brand-dark-green">
            <Store className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark-green md:text-4xl">Own a local gem? Grow with Mitho.</h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Show up where hungry locals already look when they want someplace genuinely worth trying, not just the loudest listing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MithoButton size="lg" asChild>
              <Link href="#">Claim your business</Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" size="lg" asChild>
              <Link href="#">Talk to the team</Link>
            </MithoButton>
          </div>
        </div>

        <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white p-8 shadow-[0_16px_36px_rgba(10,70,53,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep-green/65">Why join early</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="rounded-[1.35rem] border border-brand-deep-green/10 bg-surface-soft p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep-green text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-brand-dark-green">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-brand-dark-green p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-soft-beige/75">Why it works</p>
            <p className="mt-2 text-lg font-semibold">Build discovery, trust, and repeat visits in one place.</p>
            <p className="mt-2 text-sm text-white/75">
              Be easier to find, respond to real customer feedback, and earn credibility with people who care about food.
            </p>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

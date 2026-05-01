import Link from "next/link"
import { Check, Store } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

const benefits = [
  "Get discovered by nearby diners looking for real recommendations.",
  "Reply to reviews and add context without sounding like an ad.",
  "Keep your profile, hours, and standout dishes easy to trust.",
]

export function BusinessCtaSection() {
  return (
    <MithoSection id="for-business" density="compact">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-brand-deep-green/10 bg-surface-warm p-7 sm:p-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-dark-green">
            <Store className="h-4 w-4 text-brand-orange" />
            For neighborhood restaurants and local spots
          </div>

          <h2 className="mt-5 max-w-[12ch] text-3xl font-semibold leading-tight text-brand-dark-green md:text-4xl">
            Own a place people should hear about?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Mitho helps you show up where hungry locals already look when they want a place worth trying, not just the
            loudest listing on the page.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <MithoButton size="lg" asChild>
              <Link href="#">Claim your business</Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" size="lg" asChild>
              <Link href="#">Talk to the team</Link>
            </MithoButton>
          </div>
        </div>

        <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white p-7 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-deep-green/60">Why it works</p>
          <div className="mt-5 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 border-t border-brand-deep-green/10 pt-4">
                <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-deep-green text-white">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-brand-dark-green">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-surface-soft px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep-green/60">Early focus</p>
            <p className="mt-2 text-lg font-semibold text-brand-dark-green">Built for discovery, trust, and repeat visits.</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep the profile clean, respond to genuine feedback, and make it easier for first-time diners to decide.
            </p>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

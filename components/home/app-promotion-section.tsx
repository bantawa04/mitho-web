import Image from "next/image"
import Link from "next/link"
import { BellRing, Bookmark, Route } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoSection } from "@/components/ui/mitho-section"

const appBenefits = [
  {
    icon: <Bookmark className="h-5 w-5" />,
    title: "Save places you actually want to revisit",
    description: "Keep one clean shortlist instead of losing screenshots, reels, and chat links.",
  },
  {
    icon: <BellRing className="h-5 w-5" />,
    title: "Get timely local updates",
    description: "Catch fresh openings, neighborhood favorites, and places people are newly talking about.",
  },
  {
    icon: <Route className="h-5 w-5" />,
    title: "Decide faster when you are already out",
    description: "Open nearby picks and make a call without another spiral through generic maps results.",
  },
]

export function AppPromotionSection() {
  return (
    <MithoSection
      id="app"
      eyebrow="Download the app"
      title="Keep your next good meal one quick check away"
      subtitle="Built for shortlists, nearby decisions, and the places you keep meaning to try."
      tone="strong"
      density="feature"
      className="overflow-hidden"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div className="grid gap-4">
            {appBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[1.55rem] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft-beige text-brand-dark-green">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{benefit.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="#"
              className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-brand-dark-green transition-colors hover:bg-brand-soft-beige"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="text-left">
                <p className="text-xs opacity-80">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-brand-dark-green transition-colors hover:bg-brand-soft-beige"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              <div className="text-left">
                <p className="text-xs opacity-80">Get it on</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <MithoButton
              variant="outline-secondary"
              className="border-white/22 bg-white/7 text-white hover:border-white hover:bg-white hover:text-brand-dark-green"
              asChild
            >
              <Link href="#">Join the waitlist</Link>
            </MithoButton>
            <p className="text-sm text-white/72">Made for quick neighborhood decisions, not endless browsing.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_16px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
          <div className="rounded-[1.6rem] bg-[#fbf3df] p-4 text-brand-dark-green">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-deep-green/70">Mitho picks</p>
                <p className="mt-2 text-2xl font-semibold leading-tight">Near Kathmandu tonight</p>
              </div>
              <div className="rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">4.8+</div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_26px_rgba(10,70,53,0.06)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/nepali-momo-dish.jpg"
                  alt="Mitho app preview showing a restaurant recommendation"
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-semibold text-brand-dark-green">Momo Central</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Buff momo, spicy achar, busy after 7 PM, and still one of the easiest crowd-pleasing calls.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] bg-surface-soft px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Saved</p>
                    <p className="mt-1 text-xl font-semibold text-brand-dark-green">18</p>
                  </div>
                  <div className="rounded-[1.2rem] bg-surface-soft px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Alerts</p>
                    <p className="mt-1 text-xl font-semibold text-brand-dark-green">6 new</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-brand-dark-green/78">
              The app keeps nearby picks, saved places, and practical dinner decisions in one calmer flow.
            </p>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

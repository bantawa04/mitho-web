import { BellRing, Bookmark, Route } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoSection } from "@/components/ui/mitho-section"

const appBenefits = [
  {
    icon: <Bookmark className="h-5 w-5" />,
    title: "Save the places you want to try",
    description: "Build a real shortlist instead of losing screenshots and links.",
  },
  {
    icon: <BellRing className="h-5 w-5" />,
    title: "Get timely alerts",
    description: "Hear about fresh openings, returning favorites, and local offers.",
  },
  {
    icon: <Route className="h-5 w-5" />,
    title: "Decide faster when you're out",
    description: "Open nearby recommendations when the craving hits on the move.",
  },
]

export function AppPromotionSection() {
  return (
    <MithoSection
      eyebrow="Download the app"
      title="Keep your next great meal in your pocket"
      subtitle="The app should feel like habit-forming convenience: save places, get useful nudges, and decide faster when you are out."
      tone="strong"
      density="feature"
      className="overflow-hidden"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="grid gap-4">
            {appBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft-beige text-brand-dark-green">
                  {benefit.icon}
                </div>
                <p className="font-semibold text-white">{benefit.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
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
            </a>
            <a
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
            </a>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <MithoButton
              variant="outline-secondary"
              className="border-white/25 bg-white/8 text-white hover:border-white hover:bg-white hover:text-brand-dark-green"
            >
              Join the waitlist
            </MithoButton>
            <p className="text-sm text-white/70">Perfect for quick decisions on the go.</p>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-orange/18 blur-3xl" />
            <div className="relative mx-auto w-[300px] rounded-[2.75rem] border border-white/10 bg-[#083426] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="rounded-[2.2rem] bg-surface-soft p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep-green/70">Mitho picks</p>
                    <p className="text-lg font-bold text-brand-dark-green">Near Kathmandu tonight</p>
                  </div>
                  <div className="rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-brand-dark-green">
                    4.8+
                  </div>
                </div>
                <div className="overflow-hidden rounded-[1.6rem]">
                  <img src="/nepali-momo-dish.jpg" alt="Mitho Cha app preview" className="h-52 w-full object-cover" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[1.35rem] bg-white p-4 shadow-sm">
                    <p className="font-semibold text-brand-dark-green">Momo Central</p>
                    <p className="mt-1 text-sm text-muted-foreground">Buff momo, spicy achar, always busy after 7 PM.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.35rem] bg-brand-soft-beige p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Saved</p>
                      <p className="mt-1 text-xl font-bold text-brand-dark-green">18</p>
                    </div>
                    <div className="rounded-[1.35rem] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Alerts</p>
                      <p className="mt-1 text-xl font-bold text-brand-dark-green">6 new</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-10 bottom-8 hidden rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-white/65">Saved for later</p>
              <p className="mt-2 text-lg font-semibold text-white">Thakali spots in Patan</p>
              <p className="mt-1 text-sm text-white/70">Synced across your shortlist and recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

import Image from "next/image"
import Link from "next/link"
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
      id="app"
      eyebrow="Download the app"
      title="Keep your next great meal in your pocket"
      subtitle="Save the places you want to try, keep neighborhood favorites close, and make faster decisions when the craving hits."
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

          <div className="flex items-center gap-3 pt-2">
            <MithoButton
              variant="outline-secondary"
              className="border-white/25 bg-white/8 text-white hover:border-white hover:bg-white hover:text-brand-dark-green"
              asChild
            >
              <Link href="#">Join the waitlist</Link>
            </MithoButton>
            <p className="text-sm text-white/70">Built for quick decisions when you are already out and hungry.</p>
          </div>
        </div>

        <div className="relative flex justify-center pb-24 md:pb-28 lg:justify-end lg:pb-12">
          <div className="relative px-6 md:px-8">
            <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-orange/18 blur-3xl" />
            <div className="relative ml-1 h-[600px] w-72 rounded-[45px] border-8 border-zinc-900 shadow-[0_0_2px_2px_rgba(255,255,255,0.1),0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-zinc-900" />
              <div className="pointer-events-none absolute -inset-[1px] rounded-[37px] border-[3px] border-zinc-700/40" />

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[37px] bg-[#fbf6ea]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,234,0.96)_0%,rgba(244,224,166,0.78)_100%)]" />
                <div className="absolute left-1/2 top-1/2 h-24 w-12 -translate-x-1/2 -translate-y-1/2 bg-brand-orange/20 blur-[60px]" />

                <div className="relative z-10 flex h-full w-full flex-col p-3.5">
                  <div className="mb-3 flex items-center justify-between px-1 pt-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep-green/70">
                        Mitho picks
                      </p>
                      <p className="text-lg font-bold text-brand-dark-green">Near Kathmandu tonight</p>
                    </div>
                    <div className="rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                      4.8+
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-[1.9rem] border border-brand-deep-green/10 bg-white/94 shadow-[0_18px_36px_rgba(10,70,53,0.08)]">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/nepali-momo-dish.jpg"
                        alt="Mitho Cha app preview"
                        fill
                        sizes="(min-width: 1024px) 22rem, 100vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4 pb-3">
                      <p className="font-semibold text-brand-dark-green">Momo Central</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Buff momo, spicy achar, always busy after 7 PM.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white/94 px-4 py-3.5 shadow-[0_10px_20px_rgba(10,70,53,0.05)]">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Saved</p>
                      <p className="mt-1 text-xl font-bold text-brand-dark-green">18</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white/94 px-4 py-3.5">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-deep-green/65">Alerts</p>
                      <p className="mt-1 text-xl font-bold text-brand-dark-green">6 new</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute left-[-12px] top-20 h-8 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
              <div className="absolute left-[-12px] top-36 h-12 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
              <div className="absolute left-[-12px] top-52 h-12 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
              <div className="absolute right-[-12px] top-36 h-16 w-[6px] rounded-r-md bg-zinc-900 shadow-md" />
            </div>
            <div className="absolute -left-3 -bottom-12 hidden max-w-[240px] rounded-[1.5rem] border border-brand-soft-beige/55 bg-brand-soft-beige/98 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.28)] md:block lg:-left-8 lg:-bottom-10">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-deep-green/70">Saved for later</p>
              <p className="mt-2 text-lg font-semibold text-brand-dark-green">Thakali spots in Patan</p>
              <p className="mt-1 text-sm text-brand-dark-green/75">Synced across your shortlist and recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

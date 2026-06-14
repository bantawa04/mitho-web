import Image from "next/image"
import Link from "next/link"
import { Bell, BellRing, Bookmark, Compass, Home, MapPin, Route, Search, User } from "lucide-react"
import { MithoSection } from "@/components/mitho/mitho-section"
import { Device } from "@/components/ui/device"

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
      tone="warm"
      density="feature"
      className="overflow-hidden"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div className="grid gap-4">
            {appBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-background px-5 py-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft-beige text-brand-dark-green">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{benefit.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="#"
              className="inline-flex items-center gap-3 rounded-full bg-brand-dark-green px-5 py-3 text-white shadow-sm transition-colors hover:bg-brand-dark-green/90"
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
              className="inline-flex items-center gap-3 rounded-full bg-brand-dark-green px-5 py-3 text-white shadow-sm transition-colors hover:bg-brand-dark-green/90"
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
        </div>

        <Device>
          <div className="flex h-full w-full flex-col bg-[#fbf3df] text-brand-dark-green">

            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3.5 pb-1.5">
              <span className="text-[11px] font-semibold">9:41</span>
              <div className="flex items-center gap-1.5">
                <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="7" width="2.5" height="4" rx="0.5" opacity="0.35" />
                  <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.5" opacity="0.55" />
                  <rect x="8" y="2" width="2.5" height="9" rx="0.5" opacity="0.75" />
                  <rect x="12" y="0" width="3" height="11" rx="0.5" />
                </svg>
                <svg width="14" height="11" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
                  <path d="M5.5 9.5A9.5 9.5 0 0118.5 9.5" />
                  <path d="M2 6A14 14 0 0122 6" />
                </svg>
                <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" />
                  <rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor" />
                  <path d="M20 3.5v4a1.5 1.5 0 000-4z" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Location header */}
            <div className="flex items-center justify-between px-4 pb-2.5">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-brand-dark-green/40">Discovering in</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-brand-orange" />
                  <p className="text-sm font-bold">Kathmandu</p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                <Bell className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Search bar */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 rounded-xl border border-brand-dark-green/8 bg-white px-3 py-2 shadow-sm">
                <Search className="h-3.5 w-3.5 shrink-0 text-brand-dark-green/35" />
                <span className="text-[11px] text-brand-dark-green/35">Search dishes, places...</span>
              </div>
            </div>

            {/* Section label */}
            <div className="mb-2 flex items-center justify-between px-4">
              <p className="text-[11px] font-semibold">Nearby tonight</p>
              <p className="text-[10px] font-medium text-brand-deep-green">See all</p>
            </div>

            {/* Card 1 — full */}
            <div className="mx-4 mb-2.5 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative h-32">
                <Image
                  src="/nepali-momo-dish.jpg"
                  alt="Momo Central"
                  fill
                  sizes="240px"
                  className="object-cover"
                />
                <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-white/90 px-1.5 py-0.5 shadow-sm backdrop-blur-sm">
                  <span className="text-[10px] text-brand-orange">★</span>
                  <span className="text-[10px] font-semibold">4.8</span>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-[12px] font-semibold">Momo Central</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-brand-dark-green/50">Momos</span>
                  <span className="text-[10px] text-brand-dark-green/25">·</span>
                  <span className="text-[10px] text-brand-dark-green/50">0.4 km</span>
                  <span className="text-[10px] text-brand-dark-green/25">·</span>
                  <span className="text-[10px] text-brand-dark-green/50">₨350 avg</span>
                </div>
              </div>
            </div>

            {/* Card 2 — compact, partially cropped by device edge to imply scroll */}
            <div className="mx-4 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-brand-soft-beige" />
                <div>
                  <p className="text-[12px] font-semibold">Thakali Kitchen</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[10px] text-brand-orange">★ 4.6</span>
                    <span className="text-[10px] text-brand-dark-green/25">·</span>
                    <span className="text-[10px] text-brand-dark-green/50">1.2 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="mt-auto flex items-center justify-around border-t border-brand-dark-green/8 bg-[#fbf3df] px-2 pb-4 pt-2">
              <div className="flex flex-col items-center gap-0.5">
                <Home className="h-4.5 w-4.5 text-brand-dark-green" />
                <span className="text-[8px] font-semibold text-brand-dark-green">Home</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Compass className="h-4.5 w-4.5 text-brand-dark-green/35" />
                <span className="text-[8px] font-medium text-brand-dark-green/35">Explore</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Bookmark className="h-4.5 w-4.5 text-brand-dark-green/35" />
                <span className="text-[8px] font-medium text-brand-dark-green/35">Saved</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <User className="h-4.5 w-4.5 text-brand-dark-green/35" />
                <span className="text-[8px] font-medium text-brand-dark-green/35">Profile</span>
              </div>
            </div>

          </div>
        </Device>
      </div>
    </MithoSection>
  )
}

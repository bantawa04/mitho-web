import { MapPin, MessageSquare, ShieldCheck } from "lucide-react"
import { MithoSection } from "@/components/mitho/mitho-section"

const pillars = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Honest and specific",
    description: "Every review focuses on what the experience was actually like — the food, the service, the vibe — not a vague star rating with no context.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Written by your neighborhood",
    description: "Reviews come from people who eat in the same city, ride the same roads, and know when a place is coasting on old hype.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Moderated before published",
    description: "No spam dumps, no revenge reviews, no copy-paste filler. Every note is checked before it shows up on a business page.",
  },
]

export function WhyMithoSection() {
  return (
    <MithoSection
      id="why-mitho"
      eyebrow="Built different"
      title="Reviews that actually help you decide"
      subtitle="Mitho is designed around one question: is this place worth your time, money, and appetite?"
      density="feature"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {pillars.map((pillar, index) => (
          <div key={pillar.title} className="flex flex-col">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft-beige text-brand-deep-green">
                {pillar.icon}
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep-green/55">
                0{index + 1}
              </div>
            </div>
            <h3 className="mb-3 text-lg font-bold text-brand-dark-green">{pillar.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
          </div>
        ))}
      </div>


    </MithoSection>
  )
}

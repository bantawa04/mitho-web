import { MapPin, MessageSquare, ShieldCheck } from "lucide-react"
import { MithoSection } from "@/components/mitho/mitho-section"

const pillars = [
  {
    icon: <MessageSquare className="h-5 w-5 text-brand-deep-green" />,
    title: "Honest and specific",
    description: "Every review focuses on what the experience was actually like — the food, the service, the vibe — not a vague star rating with no context.",
  },
  {
    icon: <MapPin className="h-5 w-5 text-brand-deep-green" />,
    title: "Written by your neighborhood",
    description: "Reviews come from people who eat in the same city, ride the same roads, and know when a place is coasting on old hype.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-brand-deep-green" />,
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
      density="default"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              {pillar.icon}
              <h3 className="text-lg font-bold text-brand-dark-green">{pillar.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
          </div>
        ))}
      </div>
    </MithoSection>
  )
}

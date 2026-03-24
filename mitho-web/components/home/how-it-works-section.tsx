import { Search, MapPin, MessageSquare, Share2 } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Read local reviews",
    description: "See what people actually loved, what to order, and what to skip.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Search with intent",
    description: "Look up a dish, a neighborhood, or the kind of place you want tonight.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Pick nearby favorites",
    description: "Compare crowd-loved spots around you without digging through noise.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Save your next stop",
    description: "Shortlist go-to places for momos, thakali, coffee dates, and more.",
  },
]

export function HowItWorksSection() {
  return (
    <MithoSection
      eyebrow="Start here"
      title="How Mitho Cha helps you choose well"
      subtitle="A simple flow for finding places worth your appetite, time, and money."
      density="compact"
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "relative flex h-full flex-col rounded-[1.75rem] border border-brand-deep-green/10 bg-surface-soft p-6",
              "transition-all duration-200 hover:border-brand-orange/25 hover:shadow-[0_16px_36px_rgba(10,70,53,0.1)]",
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft-beige text-brand-deep-green">
                {step.icon}
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep-green/55">
                0{index + 1}
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-brand-dark-green">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </MithoSection>
  )
}

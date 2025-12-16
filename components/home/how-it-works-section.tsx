import { Search, MapPin, MessageSquare, Share2 } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Search",
    description: "Search by city, dish, or cuisine to find exactly what you're craving.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Explore",
    description: "Browse through local restaurants, food trucks, and hidden gems nearby.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Read Reviews",
    description: "Get insights from real locals with authentic reviews and photos.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Share",
    description: "Share your own food experiences and help others discover great places.",
  },
]

export function HowItWorksSection() {
  return (
    <MithoSection
      title="Your Journey to Great Food"
      subtitle="Discover your next favorite meal in just a few simple steps"
      className="bg-white"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "relative flex flex-col h-full",
              "bg-card rounded-2xl border border-border p-6",
              "transition-all duration-200 hover:shadow-lg hover:border-brand-orange/30",
            )}
          >
            {/* Step number badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
              {index + 1}
            </div>

            {/* Icon container - fixed height */}
            <div className="w-14 h-14 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4 text-brand-orange flex-shrink-0">
              {step.icon}
            </div>

            {/* Title - fixed spacing */}
            <h3 className="text-lg font-bold text-foreground mb-2 flex-shrink-0">{step.title}</h3>

            {/* Description - flex-grow to fill remaining space */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{step.description}</p>
          </div>
        ))}
      </div>
    </MithoSection>
  )
}

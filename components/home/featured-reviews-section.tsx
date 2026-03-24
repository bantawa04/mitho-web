import { MessageSquare, Play } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoCard, MithoCardHeader, MithoCardTitle, MithoCardContent } from "@/components/ui/mitho-card"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

const reviews = [
  {
    author: "Asha Tamang",
    avatar: "/nepali-woman-portrait.jpg",
    rating: 5,
    text: "Best momos I've ever had! The jhol achar is perfectly spiced and the portions are generous. A must-visit!",
    place: "Momo Central",
    dish: "Buff jhol momo",
    when: "2 days ago",
    city: "New Road, Kathmandu",
    hasMedia: true,
    mediaType: "image" as const,
    mediaUrl: "/nepali-momos-dumplings-plate.jpg",
  },
  {
    author: "Rajan Shrestha",
    avatar: "/nepali-man-portrait.jpg",
    rating: 4,
    text: "Great ambiance and authentic Newari food. The choila was exceptional. Service could be faster during peak hours.",
    place: "Newari Bhoj",
    dish: "Choila platter",
    when: "5 days ago",
    city: "Bhaktapur",
    hasMedia: true,
    mediaType: "video" as const,
    mediaUrl: "/newari-food-choila-plate.jpg",
  },
  {
    author: "Sita Gurung",
    avatar: "/nepali-woman-smiling-portrait.jpg",
    rating: 5,
    text: "Hidden gem in Patan! The sel roti with aalu tama is comfort food at its finest. Very reasonable prices too.",
    place: "Sel Roti House",
    dish: "Sel roti with aalu tama",
    when: "1 week ago",
    city: "Patan, Lalitpur",
    hasMedia: false,
    mediaType: "image" as const,
  },
]

export function FeaturedReviewsSection() {
  return (
    <MithoSection
      eyebrow="From locals"
      title="See what locals are really saying"
      titleIcon={<MessageSquare className="h-6 w-6 text-brand-orange" />}
      subtitle="Reviews should help you decide quickly, not just decorate the page."
      action={<MithoButton variant="link">Read More Reviews</MithoButton>}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <MithoCard key={index} className={index === 0 ? "bg-white lg:col-span-2" : "bg-white/95"}>
            <MithoCardHeader className={index === 0 ? "pb-4" : ""}>
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.author}
                  className="h-12 w-12 rounded-full object-cover border-2 border-brand-soft-beige"
                />
                <div className="flex-1 min-w-0">
                  <MithoCardTitle className="text-base truncate">{review.author}</MithoCardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    on {review.place} • {review.city}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-soft-beige/70 px-3 py-1 text-xs font-semibold text-brand-dark-green">
                    {review.dish}
                  </span>
                  <span className="rounded-full border border-brand-deep-green/10 bg-white px-3 py-1 text-xs text-muted-foreground">
                    {review.when}
                  </span>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent className={index === 0 ? "grid gap-6 lg:grid-cols-[1.05fr_0.95fr]" : "space-y-4"}>
              <div className="space-y-4">
                <StarRating rating={review.rating} size="sm" />
                <p className={index === 0 ? "text-lg leading-relaxed text-foreground" : "text-sm leading-relaxed text-foreground"}>
                  "{review.text}"
                </p>
              </div>
              {review.hasMedia && (
                <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-muted">
                  <img src={review.mediaUrl || "/placeholder.svg"} alt="Review media" className="h-full w-full object-cover" />
                  {review.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                        <Play className="ml-1 h-5 w-5 fill-brand-orange text-brand-orange" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </MithoCardContent>
          </MithoCard>
        ))}
      </div>
    </MithoSection>
  )
}

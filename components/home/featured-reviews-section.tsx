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
    hasMedia: false,
    mediaType: "image" as const,
  },
]

export function FeaturedReviewsSection() {
  return (
    <MithoSection
      title="See What Locals Are Saying"
      titleIcon={<MessageSquare className="h-6 w-6 text-brand-orange" />}
      subtitle="Real reviews from real food lovers"
      className="bg-brand-soft-beige/20"
      action={<MithoButton variant="link">Read More Reviews</MithoButton>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <MithoCard key={index} className="hover:shadow-md transition-shadow">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.author}
                  className="h-12 w-12 rounded-full object-cover border-2 border-brand-soft-beige"
                />
                <div className="flex-1 min-w-0">
                  <MithoCardTitle className="text-base truncate">{review.author}</MithoCardTitle>
                  <p className="text-sm text-muted-foreground truncate">on {review.place}</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent className="space-y-3">
              <StarRating rating={review.rating} size="sm" />
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">"{review.text}"</p>
              {review.hasMedia && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                  <img
                    src={review.mediaUrl || "/placeholder.svg"}
                    alt="Review media"
                    className="w-full h-full object-cover"
                  />
                  {review.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-brand-orange fill-brand-orange ml-1" />
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

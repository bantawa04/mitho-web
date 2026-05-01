import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MessageSquare, Play, Quote, Sparkles } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
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

const reviewSignals = [
  { label: "Dish mentions", value: "18K+" },
  { label: "Owner replies", value: "8.4K+" },
  { label: "Saved this week", value: "3.2K+" },
]

export function FeaturedReviewsSection() {
  return (
    <MithoSection
      id="reviews"
      eyebrow="From locals"
      title="Honest notes from people who actually ate there"
      titleIcon={<MessageSquare className="h-6 w-6 text-brand-orange" />}
      subtitle="Specific notes on taste, portions, and service so you can decide faster and skip generic hype."
      action={
        <MithoButton variant="link" asChild>
          <Link href="#trending">See what people are saving now</Link>
        </MithoButton>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="surface-raised relative overflow-hidden rounded-[2rem] p-6 lg:p-7">
          <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-brand-orange/10 blur-3xl" />
          <div className="absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-brand-soft-beige/24 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-soft-beige/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark-green">
              <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
              Useful before you go
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-brand-dark-green px-5 py-5 text-white shadow-[0_16px_40px_rgba(10,70,53,0.18)]">
              <Quote className="h-5 w-5 text-brand-soft-beige/85" />
              <p className="mt-3 text-lg font-semibold leading-snug">
                “Went for the buff sekuwa, stayed for the achar and dal that made the whole plate feel complete.”
              </p>
              <p className="mt-3 text-sm text-white/72">
                One sharp review can tell you more than a generic rating ever will.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {reviewSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white/80 px-4 py-4 shadow-[0_8px_18px_rgba(10,70,53,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">
                    {signal.label}
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-tight text-brand-dark-green">{signal.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-brand-deep-green/10 bg-surface-soft px-5 py-4">
              <p className="text-sm font-semibold text-brand-dark-green">What makes reviews useful on Mitho</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>People mention what to order, not just whether a place is “nice.”</li>
                <li>Neighborhood context helps you decide if the trip is worth it.</li>
                <li>Photos and owner replies add trust without overwhelming the page.</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white/75 px-4 py-2 shadow-[0_16px_36px_rgba(10,70,53,0.06)] backdrop-blur-sm sm:px-6">
          <div className="divide-y divide-brand-deep-green/10">
            {reviews.map((review, index) => (
              <article
                key={review.author}
                className="grid gap-4 py-6 transition-colors duration-200 hover:bg-brand-soft-beige/8 lg:grid-cols-[minmax(0,1fr)_176px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.author}
                      width={52}
                      height={52}
                      className="h-13 w-13 rounded-full border-2 border-brand-soft-beige object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-base font-semibold text-brand-dark-green">{review.author}</h3>
                        <span className="text-sm text-muted-foreground">{review.when}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {review.place} • {review.city}
                      </p>
                    </div>
                    <div className="rounded-full border border-brand-deep-green/10 bg-surface-soft px-3 py-1 text-xs font-semibold text-brand-dark-green">
                      {review.dish}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm font-medium text-brand-dark-green">{review.rating.toFixed(1)} / 5</span>
                  </div>

                  <p
                    className={
                      index === 0
                        ? "mt-4 max-w-[58ch] text-base leading-relaxed text-foreground"
                        : "mt-4 max-w-[58ch] text-sm leading-relaxed text-foreground"
                    }
                  >
                    "{review.text}"
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-deep-green">
                    Read the full review
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {review.hasMedia ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-muted">
                    <Image
                      src={review.mediaUrl || "/placeholder.svg"}
                      alt={`${review.place} review media`}
                      fill
                      sizes="(min-width: 1024px) 176px, 100vw"
                      className="object-cover"
                    />
                    {review.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/28">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 shadow-lg">
                          <Play className="ml-0.5 h-4.5 w-4.5 fill-brand-orange text-brand-orange" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden border-l-2 border-brand-soft-beige pl-4 lg:flex lg:min-h-[150px] lg:flex-col lg:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">Useful note</p>
                    <p className="text-sm font-medium leading-relaxed text-brand-dark-green">
                      Short, specific write-ups like this are often enough to decide where dinner should happen.
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

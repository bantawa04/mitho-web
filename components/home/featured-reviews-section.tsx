import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MessageSquare } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

const reviews = [
  {
    author: "Asha Tamang",
    avatar: "/nepali-woman-portrait.jpg",
    rating: 5,
    text: "Go for the buff jhol momo while it is still coming out fast. The achar is spicy, the soup has depth, and the plate is generous enough to split if you are ordering sides too.",
    place: "Momo Central",
    dish: "Buff jhol momo",
    when: "2 days ago",
    city: "New Road, Kathmandu",
    mediaUrl: "/nepali-momos-dumplings-plate.jpg",
  },
  {
    author: "Rajan Shrestha",
    avatar: "/nepali-man-portrait.jpg",
    rating: 4,
    text: "The choila has real smoke and heat, not just oil and chili. It gets busy after dark, so it works better for an early dinner than a late weekend stop.",
    place: "Newari Bhoj",
    dish: "Choila platter",
    when: "5 days ago",
    city: "Bhaktapur",
    mediaUrl: "/newari-food-choila-plate.jpg",
  },
  {
    author: "Sita Gurung",
    avatar: "/nepali-woman-smiling-portrait.jpg",
    rating: 5,
    text: "Order the sel roti with aalu tama if you want comfort food instead of just another snack stop. It feels local, filling, and better value than the busier places nearby.",
    place: "Sel Roti House",
    dish: "Sel roti with aalu tama",
    when: "1 week ago",
    city: "Patan, Lalitpur",
    mediaUrl: "",
  },
]

const proofNotes = [
  "Moderated before publishing to keep spam low.",
  "Focused on dish, portion, and neighborhood context.",
  "Helpful even when you only need one fast dinner decision.",
]

export function FeaturedReviewsSection() {
  return (
    <MithoSection
      id="reviews"
      eyebrow="From locals"
      title="Reviews that help you decide before you leave the house"
      titleIcon={<MessageSquare className="h-6 w-6 text-brand-orange" />}
      subtitle="Short, specific notes on what to order, how the place feels, and whether the trip is worth it."
      action={
        <MithoButton variant="link" asChild>
          <Link href="#trending">See what people are saving now</Link>
        </MithoButton>
      }
      density="feature"
    >
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
        <aside className="border-b border-brand-deep-green/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">
            Useful before you go
          </p>
          <p className="mt-4 max-w-[28rem] text-2xl font-semibold leading-tight text-brand-dark-green">
            One sharp local note beats a vague five-star average.
          </p>
          <p className="mt-4 max-w-[34rem] text-base leading-7 text-muted-foreground">
            Mitho reviews are most valuable when they tell you the dish to start with, the kind of crowd to expect, and
            whether the place still feels worth it after the photos stop doing the work.
          </p>

          <div className="mt-6 rounded-[1.6rem] bg-brand-dark-green px-5 py-5 text-white">
            <p className="text-sm leading-7 text-white/88">
              “Went for the buff sekuwa, stayed for the achar and dal that made the whole plate feel complete.”
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft-beige/72">
              Review excerpt from Lalitpur
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {proofNotes.map((note) => (
              <div key={note} className="flex items-start gap-3 border-t border-brand-deep-green/10 pt-3 text-sm text-brand-dark-green">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-orange" />
                <span className="leading-6">{note}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="divide-y divide-brand-deep-green/10">
          {reviews.map((review) => (
            <article key={review.author} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_140px] sm:gap-5">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-base font-semibold text-brand-dark-green">{review.author}</h3>
                      <span className="text-sm text-muted-foreground">{review.when}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.place} • {review.city}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-brand-deep-green/10 bg-white px-3 py-1 text-xs font-semibold text-brand-dark-green">
                    {review.dish}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm font-medium text-brand-dark-green">{review.rating.toFixed(1)} / 5</span>
                  </div>
                </div>

                <p className="mt-4 max-w-[62ch] text-sm leading-7 text-foreground">{review.text}</p>

                <Link
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
                >
                  Read the full review
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {review.mediaUrl ? (
                <div className="relative hidden overflow-hidden rounded-[1.25rem] bg-surface-soft sm:block">
                  <Image
                    src={review.mediaUrl}
                    alt={`${review.place} review media`}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </MithoSection>
  )
}

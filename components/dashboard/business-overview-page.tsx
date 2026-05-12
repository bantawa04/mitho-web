import Link from "next/link"
import { ArrowRight, Clock3, MessageSquare, Sparkles, Star } from "lucide-react"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import type { ManagedBusiness } from "@/components/dashboard/dashboard-business-data"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/ui/mitho-card"
import { StarRating } from "@/components/ui/mitho-rating"

interface BusinessOverviewPageProps {
  business: ManagedBusiness
}

const recentReviews = [
  {
    author: "Rajesh K.",
    rating: 5,
    date: "2 days ago",
    content: "Amazing food and great service! Will definitely come back.",
  },
  {
    author: "Priya S.",
    rating: 4,
    date: "5 days ago",
    content: "Good experience overall. The momos were delicious.",
  },
]

export function BusinessOverviewPage({ business }: BusinessOverviewPageProps) {
  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="type-eyebrow mb-3 text-brand-deep-green/70">Overview</p>
            <h1 className="type-page-title text-brand-dark-green">Run this listing without losing the thread.</h1>
            <p className="type-body mt-3 text-muted-foreground">
              Start with the highest-signal snapshot, then move into reviews, photos, hours, and business details through the workspace navigation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="capsule-cluster">Profile score {business.profileCompleteness ?? 75}%</span>
            <span className="capsule-cluster">{business.reviewCount ?? 47} customer reviews</span>
          </div>
        </div>
      </section>

      <KeyMetrics />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <MithoCard surface="business" interactive="subtle" className="bg-white">
          <MithoCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-card-title text-foreground">Recent review pulse</h2>
                <p className="type-meta">A quick read before you jump into full review management.</p>
              </div>
            </div>
          </MithoCardHeader>
          <MithoCardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={`${review.author}-${review.date}`}
                  className="rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4 shadow-[0_6px_18px_rgba(10,70,53,0.04)]"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <StarRating rating={review.rating} size="sm" />
                    <span className="ml-auto text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.content}</p>
                </div>
              ))}
            </div>

            <MithoButton variant="ghost" className="mt-5" asChild>
              <Link href={`/dashboard/businesses/${business.id}/reviews`}>
                Open reviews
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MithoButton>
          </MithoCardContent>
        </MithoCard>

        <div className="space-y-6">
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Setup summary</h2>
                  <p className="type-meta">The short operational checklist for this listing.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="space-y-3">
                {[
                  "Photos are currently the quickest trust upgrade.",
                  "Location is live, but verify the pin and nearby cues.",
                  "Review replies are still the easiest retention signal to improve this week.",
                ].map((item) => (
                  <div key={item} className="rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4">
                    <p className="text-sm leading-6 text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </MithoCardContent>
          </MithoCard>

          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Fast actions</h2>
                  <p className="type-meta">Go straight to the sections that usually need attention first.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <MithoButton variant="outline-secondary" asChild>
                  <Link href={`/dashboard/businesses/${business.id}/edit`}>Business info</Link>
                </MithoButton>
                <MithoButton variant="outline-secondary" asChild>
                  <Link href={`/dashboard/businesses/${business.id}/hours`}>Opening hours</Link>
                </MithoButton>
                <MithoButton variant="outline-secondary" asChild>
                  <Link href={`/dashboard/businesses/${business.id}/photos`}>Photos</Link>
                </MithoButton>
                <MithoButton variant="outline-secondary" asChild>
                  <Link href={`/dashboard/businesses/${business.id}/analytics`}>Analytics</Link>
                </MithoButton>
              </div>

              <div className="mt-5 rounded-[1rem] border border-brand-deep-green/10 bg-white px-4 py-4 shadow-[0_6px_18px_rgba(10,70,53,0.04)]">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-brand-orange" />
                  <p className="text-sm font-semibold text-foreground">Current rating snapshot</p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl font-bold text-brand-dark-green">4.6</span>
                  <StarRating rating={4.6} size="sm" />
                </div>
              </div>
            </MithoCardContent>
          </MithoCard>
        </div>
      </section>
    </div>
  )
}

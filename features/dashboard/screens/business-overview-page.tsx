"use client"

import Link from "next/link"
import { ArrowRight, MessageSquare, QrCode, Sparkles } from "lucide-react"
import { KeyMetrics } from "@/features/dashboard/components/key-metrics"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/mitho/mitho-card"
import { StarRating } from "@/components/mitho/mitho-rating"
import { useMyBusiness } from "@/hooks/use-businesses"
import { computeBusinessProfileCompleteness } from "@/features/dashboard/utils/dashboard-business-utils"

interface BusinessOverviewPageProps {
  businessId: string
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

export function BusinessOverviewPage({ businessId }: BusinessOverviewPageProps) {
  const { entry } = useMyBusiness(businessId)
  const profileCompleteness = entry ? computeBusinessProfileCompleteness(entry) : 0

  return (
    <div className="space-y-8 pb-12">


      <KeyMetrics />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Left Column: Recent review pulse */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="type-section-title text-foreground">Recent review pulse</h2>
              <p className="type-meta mt-1">A quick read before you jump into full review management.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={`${review.author}-${review.date}`}
                className="rounded-[1.2rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_6px_18px_rgba(10,70,53,0.04)]"
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
            <Link href={`/dashboard/businesses/${businessId}/reviews`}>
              Open reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </MithoButton>
        </section>

        <div className="space-y-10">
          {/* Setup summary */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-section-title text-foreground">Setup summary</h2>
                <p className="type-meta mt-1">The short operational checklist for this listing.</p>
              </div>
            </div>
            
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
          </section>

          {/* QR Code teaser */}
          <MithoCard surface="business" interactive="subtle" className="bg-white">
            <MithoCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="type-card-title text-foreground">Your QR code</h2>
                  <p className="type-meta">Print it. Stick it. Get more reviews.</p>
                </div>
              </div>
            </MithoCardHeader>
            <MithoCardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Download a high-res QR code that sends customers straight to your Mitho review page. Place it at your counter or entrance.
              </p>
              <MithoButton variant="ghost" className="mt-4" asChild>
                <Link href={`/dashboard/businesses/${businessId}/qr`}>
                  Get QR code
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </MithoCardContent>
          </MithoCard>
        </div>
      </section>
    </div>
  )
}

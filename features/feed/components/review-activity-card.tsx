import Link from "next/link"
import { Star } from "lucide-react"
import type { FeedItem } from "@/lib/api/feed"
import { ActorAvatar, relativeTime } from "@/features/feed/components/feed-helpers"

export function ReviewActivityCard({ item }: { item: FeedItem }) {
  const review = item.review
  if (!review) return null

  const businessLink = review.publicHref || (review.businessSlug ? `/business/${review.businessSlug}` : null)

  return (
    <article className="rounded-xl border border-brand-deep-green/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Link href={`/users/${item.actor.username}`}>
          <ActorAvatar actor={item.actor} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-muted-foreground">
            <Link href={`/users/${item.actor.username}`} className="font-semibold text-brand-dark-green hover:text-brand-orange">
              {item.actor.name}
            </Link>{" "}
            reviewed{" "}
            {businessLink ? (
              <Link href={businessLink} className="font-semibold text-brand-dark-green hover:text-brand-orange">
                {review.businessName}
              </Link>
            ) : (
              <span className="font-semibold text-brand-dark-green">{review.businessName}</span>
            )}
            <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-deep-green/50">
              {relativeTime(item.occurredAt)}
            </span>
          </p>

          <div className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
            {review.rating.toFixed(1)}
          </div>

          {review.excerpt ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{review.excerpt}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

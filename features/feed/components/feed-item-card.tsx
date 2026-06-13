import type { FeedItem } from "@/lib/api/feed"
import { ReviewActivityCard } from "@/features/feed/components/review-activity-card"
import { CollectionActivityCard } from "@/features/feed/components/collection-activity-card"

export function FeedItemCard({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "review.published":
      return <ReviewActivityCard item={item} />
    case "collection.published":
    case "collection.copied":
      return <CollectionActivityCard item={item} />
    default:
      // Unknown future activity types degrade to nothing rather than breaking the feed.
      return null
  }
}

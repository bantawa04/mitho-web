import Link from "next/link"
import { Bookmark } from "lucide-react"
import type { FeedItem } from "@/lib/api/feed"
import { ActorAvatar, relativeTime } from "@/features/feed/components/feed-helpers"

export function CollectionActivityCard({ item }: { item: FeedItem }) {
  const collection = item.collection
  if (!collection) return null

  const verb = item.type === "collection.copied" ? "copied" : "published"
  const collectionLink =
    collection.publicHref || `/users/${collection.ownerUsername}/collections/${collection.id}`

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
            {verb} a collection{" "}
            <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-deep-green/50">
              {relativeTime(item.occurredAt)}
            </span>
          </p>

          <Link
            href={collectionLink}
            className="mt-2 inline-block text-base font-semibold text-brand-dark-green hover:text-brand-orange"
          >
            {collection.title}
          </Link>

          {collection.coverImages.length > 0 ? (
            <div className="mt-3 flex items-center gap-2">
              {collection.coverImages.slice(0, 3).map((image, index) => (
                <img key={index} src={image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              ))}
            </div>
          ) : null}

          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/58">
            <Bookmark className="h-3.5 w-3.5" />
            {collection.placeCount} {collection.placeCount === 1 ? "place" : "places"}
          </p>
        </div>
      </div>
    </article>
  )
}

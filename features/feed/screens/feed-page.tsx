"use client"

import * as React from "react"
import { useFeed } from "@/hooks/use-feed"
import { MithoButton } from "@/components/mitho/mitho-button"
import { FeedItemCard } from "@/features/feed/components/feed-item-card"
import { FeedEmptyState } from "@/features/feed/components/feed-empty-state"
import { FeedSkeleton } from "@/features/feed/components/feed-skeleton"

const sectionCardClass = "rounded-xl border border-brand-deep-green/10 bg-white shadow-sm"

export function FeedPage() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeed()

  const items = React.useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data])

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: "240px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <section className={sectionCardClass}>
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <p className="type-eyebrow text-brand-deep-green/68">Following</p>
          <h1 className="mt-2 text-2xl font-semibold text-brand-dark-green">Your feed</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            The latest public reviews and collections from the people you follow.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {isLoading ? (
            <FeedSkeleton />
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-7 text-muted-foreground">
                Could not load your feed right now. Please try again shortly.
              </p>
              <div className="mt-4">
                <MithoButton variant="outline-secondary" onClick={() => refetch()}>
                  Try again
                </MithoButton>
              </div>
            </div>
          ) : items.length === 0 ? (
            <FeedEmptyState />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <FeedItemCard key={item.id} item={item} />
              ))}

              <div ref={sentinelRef} aria-hidden className="h-px" />

              {hasNextPage ? (
                <div className="flex justify-center pt-2">
                  <MithoButton
                    variant="outline-secondary"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Show more"}
                  </MithoButton>
                </div>
              ) : (
                <p className="pt-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-brand-deep-green/45">
                  You&apos;re all caught up
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

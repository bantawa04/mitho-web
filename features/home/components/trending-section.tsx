"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Flame } from "lucide-react"
import { MithoSection } from "@/components/mitho/mitho-section"
import { MithoCarousel } from "@/components/mitho/mitho-carousel"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useLatestBusinesses } from "@/hooks/use-businesses"
import {
  HomeBusinessCardSkeleton,
  TrendingBusinessCard,
} from "@/features/home/components/home-business-card"

function TrendingState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-brand-deep-green/10 bg-white px-6 py-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-brand-dark-green">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function TrendingSection() {
  const searchQuery = useLatestBusinesses(8)
  const items = searchQuery.data?.items ?? []
  const isInitialLoading = searchQuery.isLoading && !searchQuery.data

  return (
    <MithoSection
      id="trending"
      eyebrow="Trending now"
      title="What locals are pulling up this week"
      titleIcon={<Flame className="h-7 w-7 text-brand-orange" />}
      subtitle="The newest published places on Mitho, refreshed from the live public directory."
      density="feature"
      action={
        <MithoButton variant="link" asChild>
          <Link href="/explore">Browse all local picks</Link>
        </MithoButton>
      }
    >
      {isInitialLoading ? (
        <MithoCarousel className="px-1 sm:px-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <HomeBusinessCardSkeleton key={index} variant="trending" />
          ))}
        </MithoCarousel>
      ) : searchQuery.isError ? (
        <TrendingState
          title="Could not load trending places"
          body="The live home feed is having trouble right now. Try again in a moment."
          action={<MithoButton onClick={() => searchQuery.refetch()}>Retry</MithoButton>}
        />
      ) : items.length === 0 ? (
        <TrendingState
          title="No trending places yet"
          body="New public listings will show up here as soon as they land."
        />
      ) : (
        <div className={searchQuery.isFetching ? "opacity-60 transition-opacity" : undefined}>
          <MithoCarousel className="px-1 sm:px-3">
            {items.map((business) => (
              <TrendingBusinessCard key={business.id} business={business} />
            ))}
          </MithoCarousel>
        </div>
      )}
    </MithoSection>
  )
}

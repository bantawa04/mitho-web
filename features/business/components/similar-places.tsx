"use client"

import * as React from "react"
import { MithoCarousel } from "@/components/mitho/mitho-carousel"
import { useNearbyBusinesses } from "@/hooks/use-businesses"
import {
  HomeBusinessCardSkeleton,
  NearbyBusinessCard,
} from "@/features/home/components/home-business-card"

const SIMILAR_RADIUS_KM = 5
const SIMILAR_LIMIT = 8

interface SimilarPlacesProps {
  businessId: string
  coordinates?: { lat: number; lng: number } | null
  subdued?: boolean
}

export function SimilarPlaces({ businessId, coordinates, subdued = false }: SimilarPlacesProps) {
  // Without coordinates there is no anchor to rank nearby places against, so
  // skip the section entirely rather than render an empty shell.
  if (!coordinates) return null

  return (
    <SimilarPlacesContent
      businessId={businessId}
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      subdued={subdued}
    />
  )
}

function SimilarPlacesContent({
  businessId,
  latitude,
  longitude,
  subdued,
}: {
  businessId: string
  latitude: number
  longitude: number
  subdued: boolean
}) {
  // Reuses the backend haversine nearby search (sort: "nearest"), which ranks
  // by distance from these coordinates and returns a computed distanceKm.
  const nearbyQuery = useNearbyBusinesses({
    latitude,
    longitude,
    radiusKm: SIMILAR_RADIUS_KM,
    // Fetch one extra so we still have a full row after dropping the current business.
    perPage: SIMILAR_LIMIT + 1,
  })

  const places = React.useMemo(
    () =>
      (nearbyQuery.data?.items ?? [])
        .filter((item) => item.id !== businessId)
        .slice(0, SIMILAR_LIMIT),
    [nearbyQuery.data?.items, businessId],
  )

  const isInitialLoading = nearbyQuery.isLoading && !nearbyQuery.data

  // Once loaded with nothing to suggest, hide the section to keep the page tight.
  if (!isInitialLoading && places.length === 0) return null

  return (
    <section className={subdued ? "container mx-auto px-4 py-10" : "container mx-auto px-4 py-12"}>
      <div className="mb-5 max-w-2xl">
        <p className="type-eyebrow text-brand-deep-green/70">Keep exploring</p>
        <h2 className="type-section-title mt-3 text-brand-dark-green">Similar places nearby</h2>
        <p className="type-meta mt-3">
          {subdued
            ? "If this spot stays on your shortlist for later, these are a few nearby places people might also compare."
            : "If this one feels close but not quite right, these are the next places people usually compare."}
        </p>
      </div>
      <MithoCarousel>
        {isInitialLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <HomeBusinessCardSkeleton key={index} variant="nearby" />
            ))
          : places.map((business) => (
              <NearbyBusinessCard key={business.id} business={business} />
            ))}
      </MithoCarousel>
    </section>
  )
}

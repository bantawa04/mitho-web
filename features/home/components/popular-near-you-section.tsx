"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { MapPin, Navigation } from "lucide-react"
import { getCityBySlug } from "@/content/taxonomy/city-taxonomy"
import { MithoSection } from "@/components/mitho/mitho-section"
import { MithoCarousel } from "@/components/mitho/mitho-carousel"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useNearbyBusinesses } from "@/hooks/use-businesses"
import {
  HomeBusinessCardSkeleton,
  NearbyBusinessCard,
} from "@/features/home/components/home-business-card"

const KATHMANDU_FALLBACK = getCityBySlug("kathmandu")?.center ?? { lat: 27.7172, lng: 85.324 }
const NEARBY_RADIUS_KM = 5

function nearbyLocationSourceLabel(source: "fallback" | "user") {
  return source === "user" ? "Using your location" : "Using Kathmandu fallback"
}

function geolocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission was denied. Showing places near Kathmandu instead."
    case error.POSITION_UNAVAILABLE:
      return "Your location could not be determined. Showing places near Kathmandu instead."
    case error.TIMEOUT:
      return "Location request timed out. Showing places near Kathmandu instead."
    default:
      return "We could not use your location just now. Showing places near Kathmandu instead."
  }
}

function NearbyState({
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

export function PopularNearYouSection() {
  const [coords, setCoords] = React.useState({
    latitude: KATHMANDU_FALLBACK.lat,
    longitude: KATHMANDU_FALLBACK.lng,
  })
  const [locationSource, setLocationSource] = React.useState<"fallback" | "user">("fallback")
  const [isLocating, setIsLocating] = React.useState(false)
  const [geoError, setGeoError] = React.useState<string | null>(null)

  const searchQuery = useNearbyBusinesses({
    latitude: coords.latitude,
    longitude: coords.longitude,
    radiusKm: NEARBY_RADIUS_KM,
    perPage: 8,
  })

  const items = searchQuery.data?.items ?? []
  const isInitialLoading = searchQuery.isLoading && !searchQuery.data
  const subtitle =
    locationSource === "user"
      ? "Places within 5 km of your current location, ranked by distance from the live public directory."
      : "Places within 5 km of central Kathmandu, with your location used only when you choose it."

  const handleUseMyLocation = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser. Showing places near Kathmandu instead.")
      return
    }

    setIsLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationSource("user")
        setIsLocating(false)
      },
      (error) => {
        setGeoError(geolocationErrorMessage(error))
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 5,
      },
    )
  }, [])

  return (
    <MithoSection
      id="nearby"
      eyebrow="Nearby"
      title="Worth the short walk"
      titleIcon={<MapPin className="h-6 w-6 text-brand-deep-green" />}
      subtitle={subtitle}
      density="compact"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/70">
            {nearbyLocationSourceLabel(locationSource)}
          </div>
          <MithoButton
            variant="outline-secondary"
            size="sm"
            onClick={handleUseMyLocation}
            loading={isLocating}
            leftIcon={<Navigation className="h-4 w-4" />}
          >
            Use my location
          </MithoButton>
        </div>
      }
    >
      <div className="space-y-4">
        {geoError ? (
          <div className="rounded-lg border border-brand-orange/20 bg-brand-orange/5 px-4 py-3 text-sm text-muted-foreground">
            {geoError}
          </div>
        ) : null}

        {searchQuery.isFetching && !isInitialLoading ? (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Refreshing nearby places...
          </p>
        ) : null}

        {isInitialLoading ? (
          <MithoCarousel className="px-1 sm:px-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <HomeBusinessCardSkeleton key={index} variant="nearby" />
            ))}
          </MithoCarousel>
        ) : searchQuery.isError ? (
          <NearbyState
            title="Could not load nearby places"
            body="The nearby feed is having trouble right now. Try again in a moment."
            action={<MithoButton onClick={() => searchQuery.refetch()}>Retry</MithoButton>}
          />
        ) : items.length === 0 ? (
          <NearbyState
            title="No nearby places found"
            body={`We could not find published places within ${NEARBY_RADIUS_KM} km right now.`}
          />
        ) : (
          <div className={searchQuery.isFetching ? "opacity-60 transition-opacity" : undefined}>
            <MithoCarousel className="px-1 sm:px-3">
              {items.map((business) => (
                <NearbyBusinessCard key={business.id} business={business} />
              ))}
            </MithoCarousel>
          </div>
        )}
      </div>
    </MithoSection>
  )
}

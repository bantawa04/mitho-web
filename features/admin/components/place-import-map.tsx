"use client"

import { useEffect, useRef } from "react"
import { APIProvider, Map, Marker, useMap, type MapMouseEvent } from "@vis.gl/react-google-maps"
import { LocateFixed, Loader2, MapPin } from "lucide-react"
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsApiKey, type MapCoordinates } from "@/lib/google-maps"
import { useCurrentLocation } from "@/hooks/use-current-location"
import { cn } from "@/lib/utils"

interface PlaceImportMapProps {
  defaultCenter: MapCoordinates
  marker: MapCoordinates | null
  radiusMeters: number
  onSelect: (coordinates: MapCoordinates) => void
  className?: string
}

// Draws (and keeps in sync) a circle showing the search radius around the pin.
function RadiusCircle({ center, radiusMeters }: { center: MapCoordinates; radiusMeters: number }) {
  const map = useMap()
  const circleRef = useRef<google.maps.Circle | null>(null)
  const { lat, lng } = center

  useEffect(() => {
    if (!map) return
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map,
        strokeColor: "#1f6f4a",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#1f6f4a",
        fillOpacity: 0.12,
        clickable: false,
      })
    }
    circleRef.current.setCenter({ lat, lng })
    circleRef.current.setRadius(radiusMeters)
  }, [map, lat, lng, radiusMeters])

  useEffect(
    () => () => {
      circleRef.current?.setMap(null)
      circleRef.current = null
    },
    [],
  )

  return null
}

export function PlaceImportMap({ defaultCenter, marker, radiusMeters, onSelect, className }: PlaceImportMapProps) {
  const { isLocating, locationError, clearLocationError, requestCurrentLocation } = useCurrentLocation({
    unavailableMessage: "Current location is not available in this browser. Kathmandu stays selected for now.",
    errorMessage: "Could not get your current location. Allow browser location permission or keep using the current marker.",
  })

  const handleMapClick = (event: MapMouseEvent) => {
    const coordinates = event.detail.latLng
    if (coordinates) {
      onSelect(coordinates)
      clearLocationError()
    }
  }

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng
    if (latLng) {
      onSelect(latLng.toJSON())
      clearLocationError()
    }
  }

  const handleUseCurrentLocation = () => {
    requestCurrentLocation(onSelect)
  }

  if (!hasGoogleMapsApiKey()) {
    return (
      <div
        className={cn(
          "flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-border bg-[#fffdf8] px-6 py-8 text-center",
          className,
        )}
      >
        <div className="max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <MapPin className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-semibold text-brand-dark-green">Add your Google Maps key to use the picker.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Set <code className="rounded bg-white px-1.5 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your
            local env file, then reload this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-border", className)}>
      <div className="flex flex-col gap-2 border-b border-border bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Use browser GPS or click the map to set the Google Places search center.
        </p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-brand-deep-green/20 bg-white px-3 text-xs font-semibold text-brand-deep-green transition-colors hover:bg-brand-soft-beige/60 disabled:pointer-events-none disabled:opacity-60"
        >
          {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
          {isLocating ? "Locating..." : "Use current location"}
        </button>
      </div>
      {locationError ? (
        <p className="border-b border-border bg-brand-orange/10 px-3 py-2 text-xs leading-5 text-brand-dark-green">
          {locationError}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-b-xl">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={14}
            clickableIcons={false}
            disableDefaultUI
            fullscreenControl={false}
            gestureHandling="greedy"
            mapTypeControl={false}
            streetViewControl={false}
            zoomControl
            className="h-[320px] w-full"
            onClick={handleMapClick}
          >
            {marker ? <Marker position={marker} draggable onDragEnd={handleMarkerDragEnd} /> : null}
            {marker ? <RadiusCircle center={marker} radiusMeters={radiusMeters} /> : null}
          </Map>
        </APIProvider>
      </div>
    </div>
  )
}

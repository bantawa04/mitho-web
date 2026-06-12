"use client"

import { APIProvider, Map, Marker, type MapMouseEvent } from "@vis.gl/react-google-maps"
import { MapPin } from "lucide-react"
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsApiKey, type MapCoordinates } from "@/lib/google-maps"
import { cn } from "@/lib/utils"

interface GoogleMapPickerProps {
  cityLabel: string
  defaultCenter: MapCoordinates
  markerPosition: MapCoordinates | null
  onSelect: (coordinates: MapCoordinates) => void
  className?: string
}

export function GoogleMapPicker({
  cityLabel,
  defaultCenter,
  markerPosition,
  onSelect,
  className,
}: GoogleMapPickerProps) {
  const handleMapClick = (event: MapMouseEvent) => {
    const coordinates = event.detail.latLng
    if (!coordinates) return
    onSelect(coordinates)
  }

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng
    if (!latLng) return
    onSelect(latLng.toJSON())
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
            local env file, then reload this page to place the business marker in {cityLabel}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          key={`${defaultCenter.lat}-${defaultCenter.lng}`}
          defaultCenter={defaultCenter}
          defaultZoom={15}
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
          {markerPosition ? <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} /> : null}
        </Map>
      </APIProvider>
    </div>
  )
}

import { createStaticMapsUrl } from "@vis.gl/react-google-maps"

export interface MapCoordinates {
  lat: number
  lng: number
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""

export function hasGoogleMapsApiKey() {
  return GOOGLE_MAPS_API_KEY.trim().length > 0
}

export function createBusinessStaticMapUrl({
  coordinates,
  zoom = 15,
  width = 960,
  height = 720,
}: {
  coordinates: MapCoordinates
  zoom?: number
  width?: number
  height?: number
}) {
  if (!hasGoogleMapsApiKey()) return null

  return createStaticMapsUrl({
    apiKey: GOOGLE_MAPS_API_KEY,
    width,
    height,
    center: coordinates,
    zoom,
    scale: 2,
    mapType: "roadmap" as google.maps.MapTypeId,
    markers: [
      {
        location: coordinates,
        color: "0x0A4635",
      },
    ],
  })
}

export function createGoogleDirectionsUrl(coordinates: MapCoordinates) {
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
}

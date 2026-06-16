export interface MapCoordinates {
  lat: number
  lng: number
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""

const GOOGLE_STATIC_MAP_ENDPOINT = "https://maps.googleapis.com/maps/api/staticmap"
const STATIC_MAP_ZOOM = 15
const STATIC_MAP_SIZE = "640x480"
const STATIC_MAP_SCALE = 2
const STATIC_MAP_TYPE = "roadmap"
const STATIC_MAP_MARKER_COLOR = "0x0A4635"

export function hasGoogleMapsApiKey() {
  return GOOGLE_MAPS_API_KEY.trim().length > 0
}

export function createGoogleStaticMapUrl(coordinates: MapCoordinates) {
  const apiKey = GOOGLE_MAPS_API_KEY.trim()
  if (!apiKey) return null

  const center = `${coordinates.lat},${coordinates.lng}`
  const params = new URLSearchParams({
    center,
    zoom: String(STATIC_MAP_ZOOM),
    size: STATIC_MAP_SIZE,
    scale: String(STATIC_MAP_SCALE),
    maptype: STATIC_MAP_TYPE,
    markers: `color:${STATIC_MAP_MARKER_COLOR}|${center}`,
    key: apiKey,
  })
  return `${GOOGLE_STATIC_MAP_ENDPOINT}?${params.toString()}`
}

export function createGoogleDirectionsUrl(coordinates: MapCoordinates) {
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
}

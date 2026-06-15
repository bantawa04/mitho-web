export interface MapCoordinates {
  lat: number
  lng: number
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""

export function hasGoogleMapsApiKey() {
  return GOOGLE_MAPS_API_KEY.trim().length > 0
}

export function createBusinessStaticMapEndpoint(businessId: string) {
  const trimmedId = businessId.trim()
  if (!trimmedId) return null

  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!rawBaseUrl) {
    return `/api/businesses/${encodeURIComponent(trimmedId)}/static-map`
  }

  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")
  const apiBaseUrl = normalizedBaseUrl.endsWith("/api") ? normalizedBaseUrl : `${normalizedBaseUrl}/api`
  return `${apiBaseUrl}/businesses/${encodeURIComponent(trimmedId)}/static-map`
}

export function createGoogleDirectionsUrl(coordinates: MapCoordinates) {
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
}

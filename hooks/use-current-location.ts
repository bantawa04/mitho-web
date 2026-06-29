"use client"

import { useState } from "react"
import type { MapCoordinates } from "@/lib/google-maps"

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
}

interface UseCurrentLocationOptions {
  unavailableMessage?: string
  errorMessage?: string
}

export function useCurrentLocation(options: UseCurrentLocationOptions = {}) {
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const requestCurrentLocation = (onSuccess: (coordinates: MapCoordinates) => void) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError(options.unavailableMessage ?? "Current location is not available in this browser.")
      return
    }

    setIsLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false)
        onSuccess({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setIsLocating(false)
        setLocationError(options.errorMessage ?? "Could not get your current location. Check browser permission and try again.")
      },
      GEOLOCATION_OPTIONS,
    )
  }

  return {
    isLocating,
    locationError,
    clearLocationError: () => setLocationError(null),
    requestCurrentLocation,
  }
}

"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

interface GoogleAnalyticsPageTrackerProps {
  measurementId: string
}

export function GoogleAnalyticsPageTracker({
  measurementId,
}: GoogleAnalyticsPageTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()

  useEffect(() => {
    if (!measurementId) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ??
      ((...args: unknown[]) => {
        window.dataLayer.push(args)
      })

    const pageLocation = search
      ? `${window.location.origin}${pathname}?${search}`
      : `${window.location.origin}${pathname}`

    window.gtag("event", "page_view", {
      page_location: pageLocation,
      page_title: document.title,
      send_to: measurementId,
    })
  }, [measurementId, pathname, search])

  return null
}

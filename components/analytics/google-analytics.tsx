import { Suspense } from "react"
import Script from "next/script"
import { GoogleAnalyticsPageTracker } from "@/components/analytics/google-analytics-page-tracker"

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

  if (!measurementId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageTracker measurementId={measurementId} />
      </Suspense>
    </>
  )
}

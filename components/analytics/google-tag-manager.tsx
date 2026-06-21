import Script from "next/script"

const DEFAULT_GTM_ID = "GTM-M5KM4R8X"
const DEFAULT_GA_MEASUREMENT_ID = "G-N38CJR4F9F"

export function GoogleTagManager() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? DEFAULT_GTM_ID
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? DEFAULT_GA_MEASUREMENT_ID

  if (!gtmId) {
    return null
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(${JSON.stringify({ gaMeasurementId })});
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
          height="0"
          width="0"
          title="Google Tag Manager"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  )
}

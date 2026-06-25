import type React from "react"
import type { Metadata, Viewport } from "next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import {chivo, poppins} from "@/config/fonts"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { GoogleTagManager } from "@/components/analytics/google-tag-manager"
import { Toaster } from "@/components/ui/toaster"
import { RootProvider } from "@/providers/RootProvider"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getAbsoluteUrl,
  getSiteUrl,
  jsonLdScriptProps,
} from "@/lib/seo"
import "./globals.css"


export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Mitho Cha! - Where Nepal Eats",
  description:
    "Find authentic restaurants, food trucks, and hidden local gems across Nepal. Read reviews from locals and discover your next favorite meal.",
  keywords: [
    "Nepal food",
    "restaurants",
    "food trucks",
    "local cuisine",
    "Nepali food",
    "Kathmandu restaurants",
    "food discovery",
  ],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/brand/logo-icon-green.svg",
        type: "image/svg+xml",
      },
      {
        url: "/brand/icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/brand/apple-icon.png",
  },
  openGraph: {
    title: "Mitho Cha! - Where Nepal Eats",
    description: "Find authentic restaurants, food trucks, and hidden local gems across Nepal.",
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [
      {
        url: getAbsoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitho Cha! - Where Nepal Eats",
    description: "Find authentic restaurants, food trucks, and hidden local gems across Nepal.",
    images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
}

export const viewport: Viewport = {
  themeColor: "#007936",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} ${chivo.variable} font-sans antialiased`}>
        <GoogleTagManager />
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps([buildOrganizationJsonLd(), buildWebSiteJsonLd()])}
        />
        <RootProvider>
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              {children}
            </GoogleOAuthProvider>
          ) : (
            children
          )}
          <Toaster />
        </RootProvider>
        <Analytics />
      </body>
    </html>
  )
}

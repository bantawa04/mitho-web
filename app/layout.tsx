import type React from "react"
import type { Metadata, Viewport } from "next"
import { Chivo, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-chivo",
})

export const metadata: Metadata = {
  title: "Mitho Cha! - Discover the Real Taste of Nepal",
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
    title: "Mitho Cha! - Discover the Real Taste of Nepal",
    description: "Find authentic restaurants, food trucks, and hidden local gems across Nepal.",
    type: "website",
    locale: "en_US",
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
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.variable} ${chivo.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

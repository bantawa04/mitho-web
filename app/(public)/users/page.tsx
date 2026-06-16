import type { Metadata } from "next"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicUserDiscoveryPage } from "@/features/profile/screens/profile-pages"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/seo"

const USERS_TITLE = "Find Food Creators | Mitho Cha"
const USERS_DESCRIPTION =
  "Search public Mitho creators, reviews, and food lists. User pages are shareable but not indexed in search yet."

export const metadata: Metadata = {
  title: USERS_TITLE,
  description: USERS_DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/users" },
  openGraph: {
    title: USERS_TITLE,
    description: USERS_DESCRIPTION,
    url: "/users",
    siteName: SITE_NAME,
    type: "website",
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
    title: USERS_TITLE,
    description: USERS_DESCRIPTION,
    images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
}

export default function PublicUserDiscoveryRoute() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicUserDiscoveryPage />
      </main>
      <Footer />
    </div>
  )
}

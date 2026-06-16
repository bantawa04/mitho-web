import type { Metadata } from "next"
import { Header } from "@/features/home/components/header"
import { TrendingSection } from "@/features/home/components/trending-section"
import { CategoriesSection } from "@/features/home/components/categories-section"
import { PopularNearYouSection } from "@/features/home/components/popular-near-you-section"
import { WhyMithoSection } from "@/features/home/components/why-mitho-section"
import { AppPromotionSection } from "@/features/home/components/app-promotion-section"
import { BusinessCtaSection } from "@/features/home/components/business-cta-section"
import { Footer } from "@/features/home/components/footer"
import { HeroV2 } from "@/features/home/components/hero-v2"
import { searchBusinesses } from "@/lib/api/businesses"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  buildItemListJsonLd,
  businessSearchItemsToItemListEntries,
  getAbsoluteUrl,
  jsonLdScriptProps,
} from "@/lib/seo"
import type { BusinessSearchItem } from "@/types/business"

const HOME_TITLE = "Mitho Cha! - Discover the Real Taste of Nepal"
const HOME_DESCRIPTION =
  "Find authentic restaurants, cafes, food trucks, and hidden local gems across Nepal with reviews from local food lovers."

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
}

export default async function HomePage() {
  const latestBusinesses = await fetchLatestBusinessesForSeo()
  const itemListJsonLd = buildItemListJsonLd(
    "Latest food places on Mitho Cha",
    businessSearchItemsToItemListEntries(latestBusinesses),
  )

  return (
    <div className="page-shell-customer min-h-screen">
      {itemListJsonLd ? (
        <script type="application/ld+json" {...jsonLdScriptProps(itemListJsonLd)} />
      ) : null}
      <Header />

      <main id="top" className="overflow-x-hidden">
        <HeroV2 />

        <TrendingSection />
        <CategoriesSection />
        <PopularNearYouSection />

        <WhyMithoSection />

        <div className="bg-surface-soft border-y border-border">
          <BusinessCtaSection />
          <AppPromotionSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

async function fetchLatestBusinessesForSeo(): Promise<BusinessSearchItem[]> {
  try {
    const response = await searchBusinesses({ page: 1, perPage: 8, sort: "latest" })
    return response.items
  } catch {
    return []
  }
}

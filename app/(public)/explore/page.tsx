import type { Metadata } from "next"
import { ExplorePage } from "@/features/discovery/explore/explore-page"
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

const EXPLORE_TITLE = "Explore Local Food Picks | Mitho Cha!"
const EXPLORE_DESCRIPTION =
  "Search restaurants, cafes, cuisines, and establishment types across Nepal by province, district, and neighborhood with real local trust signals."

export const metadata: Metadata = {
  title: EXPLORE_TITLE,
  description: EXPLORE_DESCRIPTION,
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: EXPLORE_TITLE,
    description: EXPLORE_DESCRIPTION,
    url: "/explore",
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
    title: EXPLORE_TITLE,
    description: EXPLORE_DESCRIPTION,
    images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
  },
}

export default async function ExploreRoute() {
  const businesses = await fetchExploreBusinessesForSeo()
  const itemListJsonLd = buildItemListJsonLd(
    "Explore food places on Mitho Cha",
    businessSearchItemsToItemListEntries(businesses),
  )

  return (
    <>
      {itemListJsonLd ? (
        <script type="application/ld+json" {...jsonLdScriptProps(itemListJsonLd)} />
      ) : null}
      <ExplorePage />
    </>
  )
}

async function fetchExploreBusinessesForSeo(): Promise<BusinessSearchItem[]> {
  try {
    const response = await searchBusinesses({ page: 1, perPage: 12, sort: "recommended" })
    return response.items
  } catch {
    return []
  }
}

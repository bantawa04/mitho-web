import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CityDetailPage } from "@/features/discovery/cities/city-detail-page"
import { CITY_METADATA, getCityBySlug, isCitySlug } from "@/content/taxonomy/city-taxonomy"
import { EXPLORE_RESULTS } from "@/features/discovery/explore/explore-data"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  buildItemListJsonLd,
  exploreResultsToItemListEntries,
  getAbsoluteUrl,
  jsonLdScriptProps,
} from "@/lib/seo"

interface CityRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CITY_METADATA.map((city) => ({ slug: city.slug }))
}

export async function generateMetadata({ params }: CityRouteProps): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    return {
      title: "City not found | Mitho Cha",
      robots: { index: false, follow: true },
    }
  }

  const title = `Restaurants and Cafes in ${city.label} | Mitho Cha`
  const description = city.seoIntro || city.heroDescription
  const canonical = `/cities/${city.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
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
      title,
      description,
      images: [getAbsoluteUrl(DEFAULT_OG_IMAGE)],
    },
  }
}

export default async function CityDetailRoute({ params }: CityRouteProps) {
  const { slug } = await params

  if (!isCitySlug(slug)) {
    notFound()
  }

  const city = getCityBySlug(slug)
  const cityResults = EXPLORE_RESULTS.filter((result) => result.city === city?.label)
  const itemListJsonLd = buildItemListJsonLd(
    `${city?.label ?? "City"} food places on Mitho Cha`,
    exploreResultsToItemListEntries(cityResults),
  )

  return (
    <>
      {itemListJsonLd ? (
        <script type="application/ld+json" {...jsonLdScriptProps(itemListJsonLd)} />
      ) : null}
      <CityDetailPage slug={slug} />
    </>
  )
}

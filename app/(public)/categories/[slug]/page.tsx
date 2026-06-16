import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryDetailPage } from "@/features/discovery/categories/category-detail-page"
import { CATEGORY_METADATA, getCategoryBySlug, isCategorySlug } from "@/content/taxonomy/category-taxonomy"
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

interface CategoryRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CATEGORY_METADATA.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Category not found | Mitho Cha",
      robots: { index: false, follow: true },
    }
  }

  const title = `${category.label} in Nepal | Mitho Cha`
  const description = category.seoIntro || category.heroDescription
  const canonical = `/categories/${category.slug}`

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

export default async function CategoryDetailRoute({ params }: CategoryRouteProps) {
  const { slug } = await params

  if (!isCategorySlug(slug)) {
    notFound()
  }

  const category = getCategoryBySlug(slug)
  const categoryResults = EXPLORE_RESULTS.filter((result) => result.category === slug)
  const itemListJsonLd = buildItemListJsonLd(
    `${category?.label ?? "Category"} places on Mitho Cha`,
    exploreResultsToItemListEntries(categoryResults),
  )

  return (
    <>
      {itemListJsonLd ? (
        <script type="application/ld+json" {...jsonLdScriptProps(itemListJsonLd)} />
      ) : null}
      <CategoryDetailPage slug={slug} />
    </>
  )
}

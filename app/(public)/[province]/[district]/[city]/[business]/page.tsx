import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import axios from "axios"
import { BusinessDetailPage } from "@/features/business/screens/business-detail-page"
import {
  buildPublicBusinessHref,
  getPublicBusinessFeaturedImage,
  mapPublicBusinessToPageData,
} from "@/features/business/mappers/public-business-page-data"
import { getPublicBusinessByPath } from "@/lib/api/businesses"
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildBusinessJsonLd,
  getAbsoluteUrl,
  getBusinessReviewShareTitle,
  jsonLdScriptProps,
} from "@/lib/seo"

interface PublicBusinessRouteProps {
  params: Promise<{
    province: string
    district: string
    city: string
    business: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PublicBusinessRouteProps): Promise<Metadata> {
  const routeParams = await params
  const business = await fetchPublicBusiness(routeParams)
  console.log("Fetched business:", business)
  if (!business) {
    return {
      title: "Business not found | Mitho Cha",
    }
  }

  const location = [business.municipality?.name, business.district?.name, business.province?.name]
    .filter(Boolean)
    .join(", ")
  const description =
    business.description ??
    business.specialityNote ??
    `Discover ${business.name}${location ? ` in ${location}` : ""} on Mitho Cha.`
  const canonicalPath = buildPublicBusinessHref(business)
  const featuredImage = getPublicBusinessFeaturedImage(business) ?? DEFAULT_OG_IMAGE
  const shareTitle = getBusinessReviewShareTitle(business.name)

  return {
    title: `${business.name}${location ? ` in ${location}` : ""} | Mitho Cha`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: shareTitle,
      description,
      url: getAbsoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(featuredImage),
          width: 1200,
          height: 630,
          alt: business.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [getAbsoluteUrl(featuredImage)],
    },
  }
}

export default async function PublicBusinessDetailRoute({ params }: PublicBusinessRouteProps) {
  const routeParams = await params
  const business = await fetchPublicBusiness(routeParams)
  if (!business) notFound()

  const publicHref = buildPublicBusinessHref(business)
  if (
    routeParams.province !== business.province.slug ||
    routeParams.district !== business.district.slug ||
    routeParams.city !== business.municipality.slug ||
    routeParams.business !== business.slug
  ) {
    redirect(publicHref)
  }

  const pageData = mapPublicBusinessToPageData(business)
  const businessJsonLd = buildBusinessJsonLd(business, publicHref)

  return (
    <>
      <script type="application/ld+json" {...jsonLdScriptProps(businessJsonLd)} />
      <BusinessDetailPage
        pageData={pageData}
        claimHref={`/business/claim?listing=${business.slug}`}
        publicHref={publicHref}
      />
    </>
  )
}

async function fetchPublicBusiness(params: Awaited<PublicBusinessRouteProps["params"]>) {
  try {
    return await getPublicBusinessByPath(params)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

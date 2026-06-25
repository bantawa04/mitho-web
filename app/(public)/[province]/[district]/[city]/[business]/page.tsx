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
import { safeDecodePathSegment } from "@/lib/url-path"

interface PublicBusinessRouteProps {
  params: Promise<{
    province: string
    district: string
    city: string
    business: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: PublicBusinessRouteProps): Promise<Metadata> {
  const routeParams = normalizeRouteParams(await params)
  const business = await fetchPublicBusiness(routeParams)
  if (!business) {
    return {
      title: "Business not found | Mitho Cha",
    }
  }

  const location = [
    business.municipality?.name,
    business.district?.name,
    business.province?.name,
  ]
    .filter(Boolean)
    .join(", ")
  const description =
    business.description ??
    business.specialityNote ??
    `Discover ${business.name}${location ? ` in ${location}` : ""} on Mitho Cha.`
  const canonicalPath =
    buildPublicBusinessHref(business) ??
    `/${routeParams.province}/${routeParams.district}/${routeParams.city}/${routeParams.business}`
  const featuredImage =
    getPublicBusinessFeaturedImage(business) ?? DEFAULT_OG_IMAGE
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

export default async function PublicBusinessDetailRoute({
  params,
}: PublicBusinessRouteProps) {
  const routeParams = normalizeRouteParams(await params)
  const business = await fetchPublicBusiness(routeParams)
  if (!business) notFound()

  const publicHref = buildPublicBusinessHref(business)
  if (!publicHref) notFound()

  const canonicalParts = publicHref
    .split("/")
    .filter(Boolean)
    .map(safeDecodePathSegment)
  const canonicalBusinessSegment = canonicalParts[3] ?? ""

  if (
    routeParams.province !== canonicalParts[0] ||
    routeParams.district !== canonicalParts[1] ||
    routeParams.city !== canonicalParts[2] ||
    routeParams.business !== canonicalBusinessSegment
  ) {
    redirect(publicHref)
  }

  const pageData = mapPublicBusinessToPageData(business)
  const businessJsonLd = buildBusinessJsonLd(business, publicHref)

  return (
    <>
      <script
        type="application/ld+json"
        {...jsonLdScriptProps(businessJsonLd)}
      />
      <BusinessDetailPage
        pageData={pageData}
        claimHref={`/business/claim?listing=${business.id}`}
        publicHref={publicHref}
      />
    </>
  )
}

async function fetchPublicBusiness(
  params: Awaited<PublicBusinessRouteProps["params"]>,
) {
  try {
    return await getPublicBusinessByPath(params)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

function normalizeRouteParams(
  params: Awaited<PublicBusinessRouteProps["params"]>,
) {
  return {
    province: safeDecodePathSegment(params.province),
    district: safeDecodePathSegment(params.district),
    city: safeDecodePathSegment(params.city),
    business: safeDecodePathSegment(params.business),
  }
}

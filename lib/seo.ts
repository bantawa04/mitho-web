export const SITE_NAME = "Mitho Cha"
export const DEFAULT_OG_IMAGE = "/opengraph-image"

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"

  const urlWithProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  return new URL(urlWithProtocol.replace(/\/+$/, ""))
}

export function getAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  const siteUrl = getSiteUrl()
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, siteUrl).toString()
}

export function getBusinessReviewShareTitle(businessName: string) {
  return `Write your review for ${businessName}`
}

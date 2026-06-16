import type { Metadata } from "next"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicUserProfilePage } from "@/features/profile/screens/profile-pages"
import { getPublicProfile } from "@/lib/api/profile"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/seo"

export default async function PublicUserProfileRoute({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicUserProfilePage username={username} />
      </main>
      <Footer />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const profile = await fetchPublicProfileForMetadata(username)
  const displayName = profile?.name ?? `@${username}`
  const title = `${displayName} on Mitho Cha`
  const description =
    profile?.bio ||
    `View ${displayName}'s public Mitho profile, reviews, and food collections.`
  const canonical = `/users/${username}`

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "profile",
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

async function fetchPublicProfileForMetadata(username: string) {
  try {
    return await getPublicProfile(username)
  } catch {
    return null
  }
}

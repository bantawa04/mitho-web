import type { Metadata } from "next"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicFollowersPage } from "@/features/profile/screens/profile-pages"
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const title = `@${username}'s followers | Mitho Cha`
  const description = `See people following @${username} on Mitho Cha.`
  const canonical = `/users/${username}/followers`

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

export default async function PublicUserFollowersRoute({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicFollowersPage username={username} />
      </main>
      <Footer />
    </div>
  )
}

import { notFound } from "next/navigation"
import { CityDetailPage } from "@/features/discovery/cities/city-detail-page"
import { CITY_METADATA, isCitySlug } from "@/content/taxonomy/city-taxonomy"

interface CityRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CITY_METADATA.map((city) => ({ slug: city.slug }))
}

export default async function CityDetailRoute({ params }: CityRouteProps) {
  const { slug } = await params

  if (!isCitySlug(slug)) {
    notFound()
  }

  return <CityDetailPage slug={slug} />
}

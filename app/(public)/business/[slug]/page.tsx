import { BusinessDetailPage } from "@/features/business/screens/business-detail-page"
import { richBusinessPageData } from "@/features/business/data/business-detail-data"

export default async function BusinessDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <BusinessDetailPage pageData={richBusinessPageData} claimHref={`/business/claim?listing=${slug}`} publicHref={`/business/${slug}`} />
}

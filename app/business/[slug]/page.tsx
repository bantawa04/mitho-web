import { BusinessDetailPage } from "@/components/business/business-detail-page"
import { richBusinessPageData } from "@/components/business/business-detail-data"

export default async function BusinessDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <BusinessDetailPage pageData={richBusinessPageData} claimHref={`/business/claim?listing=${slug}`} />
}

import { BusinessDetailPage } from "@/components/business/business-detail-page"
import { richBusinessPageData } from "@/components/business/business-detail-data"

export default function BusinessDetailRoute() {
  return <BusinessDetailPage pageData={richBusinessPageData} />
}

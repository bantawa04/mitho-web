import { BusinessDetailPage } from "@/components/business/business-detail-page"
import { emptyBusinessPageData } from "@/components/business/business-detail-data"

export default function DemoEmptyBusinessPage() {
  return <BusinessDetailPage pageData={emptyBusinessPageData} />
}

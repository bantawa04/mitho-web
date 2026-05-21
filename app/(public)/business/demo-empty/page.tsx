import { BusinessDetailPage } from "@/features/business/screens/business-detail-page"
import { emptyBusinessPageData } from "@/features/business/data/business-detail-data"

export default function DemoEmptyBusinessPage() {
  return (
    <BusinessDetailPage
      pageData={emptyBusinessPageData}
      claimHref="/business/claim?listing=patan-courtyard-kitchen"
      publicHref="/business/demo-empty"
    />
  )
}

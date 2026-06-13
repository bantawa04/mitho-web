import { ReviewsRoutePage } from "@/features/dashboard/screens/business-route-pages"

interface DashboardBusinessReviewsPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessReviewsPage({ params }: DashboardBusinessReviewsPageProps) {
  const { id } = await params
  return <ReviewsRoutePage businessId={id.trim()} />
}

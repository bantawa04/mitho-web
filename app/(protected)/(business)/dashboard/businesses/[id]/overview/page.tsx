import { BusinessOverviewPage } from "@/features/dashboard/screens/business-overview-page"

interface DashboardBusinessOverviewPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessOverviewPage({ params }: DashboardBusinessOverviewPageProps) {
  const { id } = await params
  return <BusinessOverviewPage businessId={id.trim()} />
}

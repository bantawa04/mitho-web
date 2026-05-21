import { notFound } from "next/navigation"
import { BusinessOverviewPage } from "@/features/dashboard/screens/business-overview-page"
import { getManagedBusinessByIdAny } from "@/features/dashboard/data/dashboard-business-data"

interface DashboardBusinessOverviewPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessOverviewPage({ params }: DashboardBusinessOverviewPageProps) {
  const { id } = await params
  const business = getManagedBusinessByIdAny(id)

  if (!business || business.status === "claim-pending") {
    notFound()
  }

  return <BusinessOverviewPage business={business} />
}

import { notFound } from "next/navigation"
import { BusinessOverviewPage } from "@/components/dashboard/business-overview-page"
import { getManagedBusinessByIdAny } from "@/components/dashboard/dashboard-business-data"

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

import { notFound } from "next/navigation"
import { BusinessInfoRoutePage } from "@/features/dashboard/screens/business-route-pages"
import { getManagedBusinessByIdAny } from "@/features/dashboard/data/dashboard-business-data"

interface DashboardBusinessEditPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessEditPage({ params }: DashboardBusinessEditPageProps) {
  const { id } = await params
  const business = getManagedBusinessByIdAny(id)

  if (!business || business.status === "claim-pending") {
    notFound()
  }

  return <BusinessInfoRoutePage business={business} />
}

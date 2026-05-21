import { notFound } from "next/navigation"
import { SettingsRoutePage } from "@/features/dashboard/screens/business-route-pages"
import { getManagedBusinessByIdAny } from "@/features/dashboard/data/dashboard-business-data"

interface DashboardBusinessSettingsPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessSettingsPage({ params }: DashboardBusinessSettingsPageProps) {
  const { id } = await params
  const business = getManagedBusinessByIdAny(id)

  if (!business || business.status === "claim-pending") {
    notFound()
  }

  return <SettingsRoutePage business={business} />
}

import { redirect } from "next/navigation"
import { getDashboardScenario, getManagedBusinesses } from "@/features/dashboard/data/dashboard-business-data"

interface DashboardPageProps {
  searchParams: Promise<{ state?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { state } = await searchParams
  const scenario = getDashboardScenario(state)
  const managedBusinesses = getManagedBusinesses(scenario)

  if (managedBusinesses.length === 1) {
    const business = managedBusinesses[0]
    redirect(`/dashboard/businesses/${business.id}/overview${scenario !== "multi" ? `?state=${scenario}` : ""}`)
  }

  redirect(`/dashboard/businesses${scenario !== "multi" ? `?state=${scenario}` : ""}`)
}

import { BusinessSwitcherPage } from "@/features/dashboard/screens/business-switcher-page"
import { getDashboardScenario } from "@/features/dashboard/data/dashboard-business-data"

interface DashboardBusinessesPageProps {
  searchParams: Promise<{ state?: string }>
}

export default async function DashboardBusinessesPage({ searchParams }: DashboardBusinessesPageProps) {
  const { state } = await searchParams
  const scenario = getDashboardScenario(state)

  return <BusinessSwitcherPage scenario={scenario} />
}

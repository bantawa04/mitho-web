import { BusinessInfoRoutePage } from "@/features/dashboard/screens/business-route-pages"

interface DashboardBusinessEditPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessEditPage({ params }: DashboardBusinessEditPageProps) {
  const { id } = await params
  return <BusinessInfoRoutePage businessId={id.trim()} />
}

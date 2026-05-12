import { HoursRoutePage } from "@/components/dashboard/business-route-pages"

interface DashboardBusinessHoursPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessHoursPage({ params }: DashboardBusinessHoursPageProps) {
  const { id } = await params
  return <HoursRoutePage businessId={id} />
}

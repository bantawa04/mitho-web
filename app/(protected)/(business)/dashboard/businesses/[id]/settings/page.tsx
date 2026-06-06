import { SettingsRoutePage } from "@/features/dashboard/screens/business-route-pages"

interface DashboardBusinessSettingsPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessSettingsPage({ params }: DashboardBusinessSettingsPageProps) {
  const { id } = await params
  return <SettingsRoutePage businessId={id.trim()} />
}

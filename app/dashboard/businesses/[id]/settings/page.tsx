import { SettingsRoutePage } from "@/components/dashboard/business-route-pages"

interface DashboardBusinessSettingsPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessSettingsPage({ params }: DashboardBusinessSettingsPageProps) {
  const { id } = await params
  return <SettingsRoutePage businessId={id} />
}

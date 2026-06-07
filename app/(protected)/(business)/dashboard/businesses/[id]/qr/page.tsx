import { BusinessQrPage } from "@/features/dashboard/screens/business-qr-page"

interface DashboardBusinessQrPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessQrPage({ params }: DashboardBusinessQrPageProps) {
  const { id } = await params
  return <BusinessQrPage businessId={id.trim()} />
}

import { redirect } from "next/navigation"

interface DashboardBusinessIndexPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessIndexPage({ params }: DashboardBusinessIndexPageProps) {
  const { id } = await params
  redirect(`/dashboard/businesses/${id}/overview`)
}

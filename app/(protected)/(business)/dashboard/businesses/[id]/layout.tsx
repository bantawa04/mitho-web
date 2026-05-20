import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { getManagedBusinessByIdAny } from "@/components/dashboard/dashboard-business-data"
import { BusinessWorkspaceShell } from "@/components/dashboard/business-workspace-shell"

interface DashboardBusinessLayoutProps {
  children: ReactNode
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessLayout({ children, params }: DashboardBusinessLayoutProps) {
  const { id } = await params
  const business = getManagedBusinessByIdAny(id)

  if (!business || business.status === "claim-pending") {
    notFound()
  }

  return <BusinessWorkspaceShell business={business}>{children}</BusinessWorkspaceShell>
}

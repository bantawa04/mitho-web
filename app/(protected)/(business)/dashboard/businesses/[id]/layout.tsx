import type { ReactNode } from "react"
import { BusinessWorkspaceShell } from "@/features/dashboard/components/business-workspace-shell"

interface DashboardBusinessLayoutProps {
  children: ReactNode
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessLayout({ children, params }: DashboardBusinessLayoutProps) {
  const { id } = await params
  return <BusinessWorkspaceShell businessId={id.trim()}>{children}</BusinessWorkspaceShell>
}

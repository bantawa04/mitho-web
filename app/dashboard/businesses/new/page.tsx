import { AddBusinessFlow } from "@/components/business/add-business-flow"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardAddBusinessPage() {
  return (
    <div className="page-shell-business min-h-screen">
      <DashboardHeader businessName="Add business" location="Create a new listing from the same Mitho account" />

      <main className="container mx-auto px-4 pb-12 pt-8">
        <AddBusinessFlow shell="dashboard" />
      </main>

      <DashboardFooter />
    </div>
  )
}

import { AddBusinessFlow } from "@/components/business/add-business-flow"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { mockCustomerProfile } from "@/components/profile/profile-data"

export default function DashboardAddBusinessPage() {
  return (
    <>
      <DashboardHeader
        businessName="Add business"
        location="Create a new listing from the same Mitho account"
        signedInUser={{ name: mockCustomerProfile.name, avatarUrl: mockCustomerProfile.avatarUrl, href: "/profile" }}
      />

      <main className="container mx-auto px-4 pb-12 pt-8">
        <AddBusinessFlow shell="dashboard" />
      </main>

      <DashboardFooter />
    </>
  )
}

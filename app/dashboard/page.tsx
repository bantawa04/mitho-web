import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KeyMetrics } from "@/components/dashboard/key-metrics"
import { TrafficAnalytics } from "@/components/dashboard/traffic-analytics"
import { ReviewsOverview } from "@/components/dashboard/reviews-overview"
import { MediaPerformance } from "@/components/dashboard/media-performance"
import { ProfileStatus } from "@/components/dashboard/profile-status"
import { SponsoredPromotion } from "@/components/dashboard/sponsored-promotion"
import { IntegrationStatus } from "@/components/dashboard/integration-status"
import { SettingsManagement } from "@/components/dashboard/settings-management"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"

export default function DashboardPage() {
  return (
    <div className="page-shell-business min-h-screen">
      <DashboardHeader businessName="The Himalayan Kitchen" location="Thamel, Kathmandu" planType="Free Plan" />

      <main className="container mx-auto px-4 pb-12 pt-8">
        <section className="motion-soft-rise mb-8 rounded-[2rem] border border-brand-deep-green/10 bg-surface-business p-6 shadow-[0_12px_36px_rgba(10,70,53,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="type-eyebrow mb-3 text-brand-deep-green/70">Business dashboard</p>
              <h1 className="type-page-title text-brand-dark-green">Run your Mitho presence with more clarity.</h1>
              <p className="type-body mt-3 text-muted-foreground">
                Track profile health, customer feedback, and growth opportunities from one operational home base.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="capsule-cluster">Profile score 75%</span>
              <span className="capsule-cluster">47 customer reviews</span>
            </div>
          </div>
        </section>

        <KeyMetrics />

        <TrafficAnalytics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ReviewsOverview />
          </div>

          <div className="space-y-8">
            <MediaPerformance />
            <ProfileStatus />
          </div>
        </div>

        <SponsoredPromotion />
        <IntegrationStatus />
        <SettingsManagement />
      </main>

      <DashboardFooter />
    </div>
  )
}

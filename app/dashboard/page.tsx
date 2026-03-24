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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader businessName="The Himalayan Kitchen" location="Thamel, Kathmandu" planType="Free Plan" />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Key Metrics Overview */}
        <KeyMetrics />

        {/* Traffic & Engagement Analytics */}
        <TrafficAnalytics />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reviews Overview */}
          <div>
            <ReviewsOverview />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Media Performance */}
            <MediaPerformance />

            {/* Profile Status */}
            <ProfileStatus />
          </div>
        </div>

        {/* Sponsored Promotion */}
        <SponsoredPromotion />

        {/* Integration Status */}
        <IntegrationStatus />

        {/* Settings & Management */}
        <SettingsManagement />
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}

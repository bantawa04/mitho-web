import { Header } from "@/features/home/components/header"
import { TrendingSection } from "@/features/home/components/trending-section"
import { CategoriesSection } from "@/features/home/components/categories-section"
import { PopularNearYouSection } from "@/features/home/components/popular-near-you-section"
import { WhyMithoSection } from "@/features/home/components/why-mitho-section"
import { AppPromotionSection } from "@/features/home/components/app-promotion-section"
import { BusinessCtaSection } from "@/features/home/components/business-cta-section"
import { Footer } from "@/features/home/components/footer"
import { HeroV2 } from "@/features/home/components/hero-v2"

export default function HomePage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main id="top" className="overflow-x-hidden">
        <HeroV2 />

        <TrendingSection />
        <CategoriesSection />
        <PopularNearYouSection />

        <WhyMithoSection />

        <div className="bg-surface-soft border-y border-border">
          <BusinessCtaSection />
          <AppPromotionSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

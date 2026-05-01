import { Header } from "@/components/home/header"
import { TrendingSection } from "@/components/home/trending-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { PopularNearYouSection } from "@/components/home/popular-near-you-section"
import { FeaturedReviewsSection } from "@/components/home/featured-reviews-section"
import { AppPromotionSection } from "@/components/home/app-promotion-section"
import { BusinessCtaSection } from "@/components/home/business-cta-section"
import { SponsoredListingsSection } from "@/components/home/sponsored-listings-section"
import { FinalCtaSection } from "@/components/home/final-cta-section"
import { Footer } from "@/components/home/footer"
import { HeroV2 } from "@/components/home/hero-v2"

export default function HomePage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main id="top" className="overflow-x-hidden">
        <HeroV2 />

        <div className="bg-gradient-to-b from-surface-soft via-surface-warm/35 to-surface-soft">
          <FeaturedReviewsSection />
        </div>

        <div className="border-y border-brand-deep-green/10 bg-gradient-to-b from-surface-soft via-brand-soft-beige/30 to-surface-warm">
          <TrendingSection />
          <CategoriesSection />
          <PopularNearYouSection />
        </div>

        <div className="bg-gradient-to-b from-surface-soft via-white to-surface-warm/65">
          <BusinessCtaSection />
          <AppPromotionSection />
          <SponsoredListingsSection />
          <FinalCtaSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}

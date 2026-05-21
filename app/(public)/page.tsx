import { Header } from "@/features/home/components/header"
import { TrendingSection } from "@/features/home/components/trending-section"
import { CategoriesSection } from "@/features/home/components/categories-section"
import { PopularNearYouSection } from "@/features/home/components/popular-near-you-section"
import { FeaturedReviewsSection } from "@/features/home/components/featured-reviews-section"
import { AppPromotionSection } from "@/features/home/components/app-promotion-section"
import { BusinessCtaSection } from "@/features/home/components/business-cta-section"
import { SponsoredListingsSection } from "@/features/home/components/sponsored-listings-section"
import { FinalCtaSection } from "@/features/home/components/final-cta-section"
import { Footer } from "@/features/home/components/footer"
import { HeroV2 } from "@/features/home/components/hero-v2"

export default function HomePage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main id="top" className="overflow-x-hidden">
        <HeroV2 />

        <div className="bg-[linear-gradient(180deg,#fffdf8_0%,#fff9f0_100%)]">
          <FeaturedReviewsSection />
        </div>

        <div className="border-y border-brand-deep-green/10 bg-[linear-gradient(180deg,#fffef9_0%,#fbf6eb_100%)]">
          <TrendingSection />
          <CategoriesSection />
          <PopularNearYouSection />
        </div>

        <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#fbf5e9_100%)]">
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

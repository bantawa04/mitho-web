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

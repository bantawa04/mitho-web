import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { AdSection } from "@/components/home/ad-section"
import { TrendingSection } from "@/components/home/trending-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { PopularNearYouSection } from "@/components/home/popular-near-you-section"
import { FeaturedReviewsSection } from "@/components/home/featured-reviews-section"
import { TopRatedSection } from "@/components/home/top-rated-section"
import { AppPromotionSection } from "@/components/home/app-promotion-section"
import { BusinessCtaSection } from "@/components/home/business-cta-section"
import { SponsoredListingsSection } from "@/components/home/sponsored-listings-section"
import { FinalCtaSection } from "@/components/home/final-cta-section"
import { Footer } from "@/components/home/footer"
import { FooterV2 } from "@/components/home/footer-v2"

import { MithoTabBar } from "@/components/ui/mitho-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Sticky Header */}
      <Header />

      <main>
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. How It Works */}
        <HowItWorksSection />

        {/* 4. Ad Placement */}
        <AdSection />

        {/* 5. Trending Eateries */}
        <TrendingSection />

        {/* 6. Browse by Category */}
        <CategoriesSection />

        {/* 7. Popular Near You */}
        <PopularNearYouSection />

        {/* 8. Featured Reviews */}
        <FeaturedReviewsSection />

        {/* 9. Top Rated This Week */}
        <TopRatedSection />

        {/* 10. Mobile App Promotion */}
        <AppPromotionSection />

        {/* 11. Business CTA */}
        <BusinessCtaSection />

        {/* 12. Sponsored Listings */}
        <SponsoredListingsSection />

        {/* 13. Final CTA */}
        <FinalCtaSection />
      </main>

      {/* 14. Footer */}
      {/* <Footer /> */}
      <FooterV2 />

      {/* Mobile Bottom Tab Bar */}
      <MithoTabBar />
    </div>
  )
}

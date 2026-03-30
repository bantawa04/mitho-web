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
import { MithoTabBar } from "@/components/ui/mitho-navigation"

export default function HomePage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="overflow-x-hidden pb-20 lg:pb-0">
        <HeroSection />

        <div className="bg-white">
          <HowItWorksSection />
        </div>

        <div className="border-y border-brand-deep-green/10 bg-gradient-to-b from-white via-brand-soft-beige/10 to-brand-soft-beige/40">
          <TrendingSection />
          <CategoriesSection />
          <PopularNearYouSection />
          <TopRatedSection />
          <AdSection />
          <SponsoredListingsSection />
        </div>

        <div className="bg-surface-soft">
          <FeaturedReviewsSection />
        </div>

        <div className="bg-white">
          <AppPromotionSection />
          <BusinessCtaSection />
          <FinalCtaSection />
        </div>
      </main>

      <Footer />
      <MithoTabBar />
    </div>
  )
}

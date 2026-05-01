import Link from "next/link"
import { Compass, Store } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

export function FinalCtaSection() {
  return (
    <MithoSection density="compact">
      <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white px-6 py-8 shadow-[0_8px_24px_rgba(10,70,53,0.04)] md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight text-brand-dark-green md:text-4xl">
              Start with the places someone local would happily recommend.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Browse trusted picks, follow the dishes people keep talking about, and make the dinner decision faster.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <MithoButton size="lg" asChild>
              <Link href="#trending">
                <Compass className="h-5 w-5" />
                Explore places
              </Link>
            </MithoButton>
            <MithoButton variant="outline-secondary" size="lg" asChild>
              <Link href="#for-business">
                <Store className="h-5 w-5" />
                Add your business
              </Link>
            </MithoButton>
          </div>
        </div>
      </div>
    </MithoSection>
  )
}

import Link from "next/link"
import { Compass, Store } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { MithoButton } from "@/components/ui/mitho-button"

export function FinalCtaSection() {
  return (
    <MithoSection density="compact">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-brand-deep-green/10 bg-[linear-gradient(135deg,#fff8ea_0%,#fffdf8_55%,#fff4da_100%)] p-8 text-center md:p-12 lg:p-14">
        <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-brand-orange/12 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-brand-soft-beige/28 blur-2xl" />

        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-balance text-brand-dark-green md:text-4xl lg:text-5xl">
            Start with the places people would gladly recommend to a friend.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore trusted local picks, follow the dishes people keep talking about, and let real reviews guide the final call.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MithoButton size="lg" asChild>
              <Link href="#trending">
                <Compass className="h-5 w-5" />
                Explore places
              </Link>
            </MithoButton>
            <MithoButton variant="link" size="lg" asChild>
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

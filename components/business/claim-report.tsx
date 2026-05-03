import { Building2, Flag } from "lucide-react"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"

interface ClaimReportProps {
  subdued?: boolean
}

export function ClaimReport({ subdued = false }: ClaimReportProps) {
  return (
    <section className="container mx-auto px-4 pb-12 pt-2">
      <MithoCard surface={subdued ? "customer" : "inset"} interactive="none" className={subdued ? "border-brand-deep-green/8 shadow-[0_8px_22px_rgba(10,70,53,0.04)]" : undefined}>
        <MithoCardContent className="flex flex-col items-start justify-between gap-5 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deep-green/10">
              <Building2 className="h-5 w-5 text-brand-deep-green" />
            </div>
            <div>
              <p className="font-medium text-brand-dark-green">Is this your business?</p>
              <a href="#" className="text-brand-orange hover:underline text-sm font-medium">
                {subdued ? "Claim and verify this listing" : "Claim this Business"}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
              <Flag className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="font-medium text-brand-dark-green">See something wrong?</p>
              <a href="#" className="text-danger hover:underline text-sm font-medium">
                Report Incorrect Information
              </a>
            </div>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}

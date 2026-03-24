import { Building2, Flag } from "lucide-react"
import { MithoCard, MithoCardContent } from "@/components/ui/mitho-card"

export function ClaimReport() {
  return (
    <section className="container mx-auto px-4 py-6">
      <MithoCard>
        <MithoCardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-deep-green/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-brand-deep-green" />
            </div>
            <div>
              <p className="font-medium">Is this your business?</p>
              <a href="#" className="text-brand-orange hover:underline text-sm font-medium">
                Claim this Business
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <Flag className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="font-medium">See something wrong?</p>
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

import Link from "next/link"
import { ArrowRight, Building2, Flag, MessageSquareWarning, ShieldCheck, UserRound, Users } from "lucide-react"
import { mockAdminHomeData } from "@/features/admin/data/admin-data"
import { MithoButton } from "@/components/mitho/mitho-button"

function SummaryCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="rounded-xl surface-admin-panel p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-4xl font-semibold leading-none text-brand-dark-green">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  )
}

export function AdminHomePage() {
  return (
    <div className="space-y-6 pb-12">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Pending business claims" value={String(mockAdminHomeData.pendingClaimsCount)} helper="Ownership requests waiting on verification or an approval pass." />
        <SummaryCard label="Flagged reviews" value={String(mockAdminHomeData.flaggedReviewsCount)} helper="Reviews that may need policy, duplication, or abuse review." />
        <SummaryCard label="Reported content" value={String(mockAdminHomeData.reportedContentCount)} helper="Photos, listings, or creator content that users have disputed." />
        <SummaryCard label="Support issues" value={String(mockAdminHomeData.unresolvedSupportCount)} helper="Open operator-facing problems that still need a clean handoff or resolution." />
      </section>
    </div>
  )
}

export function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  icon,
}: {
  eyebrow: string
  title: string
  description: string
  href: string
  ctaLabel: string
  icon: "claims" | "reviews" | "reports" | "businesses" | "customers" | "users"
}) {
  const iconMap = {
    claims: ShieldCheck,
    reviews: MessageSquareWarning,
    reports: Flag,
    businesses: Building2,
    customers: UserRound,
    users: Users,
  }
  const Icon = iconMap[icon]

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-xl surface-admin-panel p-6">
        <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="type-page-title text-brand-dark-green">{title}</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-brand-dark-green shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="rounded-xl surface-admin-panel p-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-brand-dark-green">This is the next admin surface to flesh out.</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The route is grouped and reachable so the admin dashboard home can link somewhere real, but the full workflow design for this page still belongs to a later pass.
          </p>
        </div>
        <div className="mt-5">
          <MithoButton asChild variant="outline-secondary">
            <Link href={href}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </MithoButton>
        </div>
      </section>
    </div>
  )
}

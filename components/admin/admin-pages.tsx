import Link from "next/link"
import type { ComponentType } from "react"
import { Activity, ArrowRight, Building2, Flag, MessageSquareWarning, ShieldCheck, Users } from "lucide-react"
import { mockAdminHomeData } from "@/components/admin/admin-data"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"

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
    <div className="rounded-[1.5rem] surface-admin-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">{label}</p>
      <p className="mt-3 text-4xl font-semibold leading-none text-brand-dark-green">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  )
}

function QueuePanel({
  title,
  count,
  href,
  icon,
  items,
}: {
  title: string
  count: number
  href: string
  icon: ComponentType<{ className?: string }>
  items: typeof mockAdminHomeData.claimQueuePreview
}) {
  const Icon = icon

  return (
    <section className="rounded-[1.7rem] surface-admin-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft-beige/70 text-brand-dark-green">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-brand-dark-green">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">The fastest-moving items that likely need a decision today.</p>
          </div>
        </div>
        <MithoBadge variant="moderation">{count} pending</MithoBadge>
      </div>

      <div className="mt-5 border-t border-brand-deep-green/10">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block border-b border-brand-deep-green/10 py-4 last:border-b-0 transition-colors hover:bg-brand-soft-beige/18"
          >
            <p className="font-semibold text-brand-dark-green">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.subtitle}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/55">{item.meta}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <MithoButton asChild variant="outline-secondary">
          <Link href={href}>
            Open queue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MithoButton>
      </div>
    </section>
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

      <section className="grid gap-6 xl:grid-cols-3">
        <QueuePanel
          title="Business claim approvals"
          count={mockAdminHomeData.pendingClaimsCount}
          href="/admin/business-claims"
          icon={ShieldCheck}
          items={mockAdminHomeData.claimQueuePreview}
        />
        <QueuePanel
          title="Review moderation queue"
          count={mockAdminHomeData.flaggedReviewsCount}
          href="/admin/reviews/moderation"
          icon={MessageSquareWarning}
          items={mockAdminHomeData.reviewModerationPreview}
        />
        <QueuePanel
          title="Reported content"
          count={mockAdminHomeData.reportedContentCount}
          href="/admin/reported-content"
          icon={Flag}
          items={mockAdminHomeData.reportedContentPreview}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[1.8rem] surface-admin-panel p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft-beige/70 text-brand-dark-green">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-dark-green">Platform health snapshot</h2>
              <p className="mt-1 text-sm text-muted-foreground">A quick read on business access and trust activity before you dive deeper.</p>
            </div>
          </div>

          <div className="mt-5 border-t border-brand-deep-green/10">
            {mockAdminHomeData.healthStats.map((stat) => (
              <div key={stat.id} className="border-b border-brand-deep-green/10 py-4 last:border-b-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-brand-dark-green">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] surface-admin-panel p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-brand-dark-green">Recent admin activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">A lightweight audit trail preview from the latest moderation and approval decisions.</p>
            </div>
            <MithoBadge variant="neutral">Latest decisions</MithoBadge>
          </div>

          <div className="mt-5 border-t border-brand-deep-green/10">
            {mockAdminHomeData.recentAdminActions.map((item) => (
              <div key={item.id} className="border-b border-brand-deep-green/10 py-4 last:border-b-0">
                <p className="font-semibold text-brand-dark-green">{item.action}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.target}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/55">
                  {item.actor} • {item.when}
                </p>
              </div>
            ))}
          </div>
        </div>
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
  icon: "claims" | "reviews" | "reports" | "businesses" | "users"
}) {
  const iconMap = {
    claims: ShieldCheck,
    reviews: MessageSquareWarning,
    reports: Flag,
    businesses: Building2,
    users: Users,
  }
  const Icon = iconMap[icon]

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] surface-admin-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">{eyebrow}</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="type-page-title text-brand-dark-green">{title}</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] surface-admin-panel p-6">
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

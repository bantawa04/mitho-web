"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import {
  BarChart3,
  Building2,
  Camera,
  ChevronLeft,
  Clock3,
  LayoutDashboard,
  Loader2,
  Menu,
  MessageSquare,
  Settings,
} from "lucide-react"
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMyBusiness } from "@/hooks/use-businesses"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import type { MyBusinessEntry } from "@/types/business"

interface BusinessWorkspaceShellProps {
  businessId: string
  children: ReactNode
}

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, segment: "overview" },
  { key: "reviews", label: "Reviews", icon: MessageSquare, segment: "reviews" },
  { key: "photos", label: "Photos", icon: Camera, segment: "photos" },
  { key: "edit", label: "Business Info", icon: Building2, segment: "edit" },
  { key: "hours", label: "Hours", icon: Clock3, segment: "hours" },
  { key: "analytics", label: "Analytics", icon: BarChart3, segment: "analytics" },
  { key: "settings", label: "Settings", icon: Settings, segment: "settings" },
]

function deriveDisplayLocation(entry: MyBusinessEntry): string {
  const b = entry.business
  const parts: string[] = []
  if (b.area) parts.push(b.area)
  if (b.municipality?.name) parts.push(b.municipality.name)
  if (b.district?.name) parts.push(b.district.name)
  return parts.join(", ") || b.addressLine1
}

function BusinessWorkspaceNav({
  businessId,
  pathname,
  mobile = false,
}: {
  businessId: string
  pathname: string
  mobile?: boolean
}) {
  return (
    <nav aria-label="Business dashboard navigation" className={cn(mobile ? "space-y-2" : "space-y-2")}>
      <Link
        href="/dashboard/businesses"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to businesses
      </Link>

      {navItems.map((item) => {
        const href = `/dashboard/businesses/${businessId}/${item.segment}`
        const isActive = pathname === href
        const Icon = item.icon

        return (
          <Link
            key={item.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-brand-deep-green text-white shadow-[0_12px_24px_rgba(10,70,53,0.18)]"
                : "text-brand-dark-green hover:bg-brand-soft-beige/45",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function BusinessWorkspaceShell({ businessId, children }: BusinessWorkspaceShellProps) {
  const cleanBusinessId = businessId.trim()
  const pathname = usePathname()
  const activeItem = navItems.find((item) => pathname.endsWith(`/${item.segment}`))
  const { entry, isLoading } = useMyBusiness(cleanBusinessId)
  const { currentUser } = useAuthSnapshot()

  const name = entry?.business.name ?? (isLoading ? "Loading…" : "Business workspace")
  const location = entry ? deriveDisplayLocation(entry) : (isLoading ? "" : "Business management")

  return (
    <>
      <DashboardHeader
        businessName={name}
        location={location}
        signedInUser={currentUser ?? undefined}
        actions={
          <Sheet>
            <SheetTrigger asChild>
              <MithoButton variant="outline-secondary" size="sm" className="lg:hidden" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open navigation</span>
              </MithoButton>
            </SheetTrigger>
            <SheetContent side="left" className="border-brand-deep-green/10 bg-white">
              <SheetHeader className="border-b border-brand-deep-green/10">
                <SheetTitle>{entry?.business.name ?? "Business"}</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <BusinessWorkspaceNav businessId={cleanBusinessId} pathname={pathname} mobile />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-deep-green/40" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-[1.7rem] border border-brand-deep-green/10 bg-white p-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
                <BusinessWorkspaceNav businessId={cleanBusinessId} pathname={pathname} />
              </div>
            </aside>

            <div>
              <div className="mb-5 lg:hidden">
                <p className="type-eyebrow text-brand-deep-green/68">Current section</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{activeItem?.label ?? "Overview"}</h2>
              </div>
              {children}
            </div>
          </div>
        )}
      </div>

      <DashboardFooter />
    </>
  )
}

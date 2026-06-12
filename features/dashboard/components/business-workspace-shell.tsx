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
  QrCode,
  Settings,
} from "lucide-react"
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMyBusiness } from "@/hooks/use-businesses"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { formatBusinessEntryLocation } from "@/features/dashboard/utils/dashboard-business-utils"

interface BusinessWorkspaceShellProps {
  businessId: string
  children: ReactNode
}

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, segment: "overview" },
  { key: "reviews", label: "Reviews", icon: MessageSquare, segment: "reviews" },
  { key: "photos", label: "Photos", icon: Camera, segment: "photos" },
  { key: "qr", label: "QR Code", icon: QrCode, segment: "qr" },
  { key: "edit", label: "Business Info", icon: Building2, segment: "edit" },
  { key: "hours", label: "Hours", icon: Clock3, segment: "hours" },
  { key: "analytics", label: "Analytics", icon: BarChart3, segment: "analytics" },
  { key: "settings", label: "Settings", icon: Settings, segment: "settings" },
]

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
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand-deep-green"
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
              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted",
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
  const location = entry ? formatBusinessEntryLocation(entry, "Business management") : (isLoading ? "" : "Business management")

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
            <SheetContent side="left" className="border-border bg-white">
              <SheetHeader className="border-b border-border">
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
          <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-border bg-white p-4 shadow-sm">
                <BusinessWorkspaceNav businessId={cleanBusinessId} pathname={pathname} />
              </div>
            </aside>

            <div>
              <div className="mb-4 lg:hidden">
                <p className="text-xs font-semibold text-muted-foreground">Current section</p>
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

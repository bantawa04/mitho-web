"use client"

import Link from "next/link"
import { Building2, History, Images, LayoutDashboard, MessageSquareWarning, Settings, Shapes, Soup, UserRound, Users } from "lucide-react"
import { BrandLogo } from "@/components/mitho/brand-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { cn } from "@/lib/utils"

export const adminNavSections = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/cuisines", label: "Cuisines", icon: Soup },
  { href: "/admin/establishment-types", label: "Establishment Types", icon: Shapes },
  { href: "/admin/reviews/moderation", label: "Review Moderation", icon: MessageSquareWarning, permissions: ["reviews.read", "reviews.update", "reviews.delete"] },
  { href: "/admin/gallery", label: "Gallery Approval", icon: Images, permissions: ["media.review"] },
  { href: "/admin/customers", label: "Customers", icon: UserRound },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: History },
] as const

const adminHiddenRouteItems = [
  { href: "/admin/business-claims", label: "Business Claims", icon: Building2 },
  { href: "/admin/reported-content", label: "Reported Content", icon: MessageSquareWarning },
  { href: "/admin/settings", label: "Account Settings", icon: Settings },
] as const

const adminRouteItems = [...adminNavSections, ...adminHiddenRouteItems]

export function getActiveAdminItem(pathname: string) {
  return (
    adminRouteItems
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((left, right) => right.href.length - left.href.length)[0]
    ?? adminNavSections[0]
  )
}

export function AdminSidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/admin" className="inline-flex items-center">
      {compact ? (
        <BrandLogo kind="icon" tone="green" className="h-10 w-auto" alt="Mitho Cha! logo" priority />
      ) : (
        <>
          <BrandLogo
            kind="full"
            tone="green"
            className="h-12 w-auto group-data-[collapsible=icon]:hidden"
            alt="Mitho Cha! logo"
            priority
          />
          <BrandLogo
            kind="icon"
            tone="green"
            className="hidden h-10 w-auto group-data-[collapsible=icon]:block"
            alt="Mitho Cha! logo"
            priority
          />
        </>
      )}
    </Link>
  )
}

export function AdminSidebarNav({ pathname }: { pathname: string }) {
  const { authUser } = useAuthSnapshot()
  const visibleItems = adminNavSections.filter((item) => {
    if (!("permissions" in item) || !item.permissions) return true
    if (!authUser) return false
    return item.permissions.some((permission) => authUser.staffPermissions.includes(permission))
  })
  const activeItem = (
    adminRouteItems
      .filter((item) => visibleItems.some((visibleItem) => visibleItem.href === item.href))
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((left, right) => right.href.length - left.href.length)[0]
    ?? visibleItems[0]
  )
  return (
    <SidebarMenu className="gap-2">
      {visibleItems.map((item) => {
        const Icon = item.icon
        const isActive = item.href === activeItem?.href

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
              size="lg"
              className={cn(
                "rounded-[0.95rem] px-4 text-sm font-medium text-brand-dark-green transition-colors duration-200 hover:bg-white/72 hover:text-brand-dark-green data-[active=true]:bg-brand-dark-green data-[active=true]:text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
              )}
            >
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                <Icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function AdminSidebarFrame({ pathname }: { pathname: string }) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-brand-deep-green/10 bg-surface-admin/72"
    >
      <SidebarHeader className="border-b border-brand-deep-green/10 px-4 py-5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <AdminSidebarBrand />
      </SidebarHeader>
      <SidebarContent className="px-3 py-5 group-data-[collapsible=icon]:px-2">
        <AdminSidebarNav pathname={pathname} />
      </SidebarContent>
      <SidebarRail className="after:bg-brand-deep-green/12 hover:after:bg-brand-deep-green/20" />
    </Sidebar>
  )
}

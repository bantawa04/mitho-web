"use client"

import Link from "next/link"
import { Building2, LayoutDashboard, MessageSquareWarning, UserRound, Users } from "lucide-react"
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
import { cn } from "@/lib/utils"

export const adminNavSections = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/reviews/moderation", label: "Review Moderation", icon: MessageSquareWarning },
  { href: "/admin/customers", label: "Customers", icon: UserRound },
  { href: "/admin/users", label: "Users", icon: Users },
] as const

const adminHiddenRouteItems = [
  { href: "/admin/business-claims", label: "Business Claims", icon: Building2 },
  { href: "/admin/reported-content", label: "Reported Content", icon: MessageSquareWarning },
] as const

const adminRouteItems = [...adminNavSections, ...adminHiddenRouteItems]

export function getActiveAdminItem(pathname: string) {
  return adminRouteItems.find((item) => item.href === pathname) ?? adminNavSections[0]
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
  return (
    <SidebarMenu className="gap-2">
      {adminNavSections.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

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

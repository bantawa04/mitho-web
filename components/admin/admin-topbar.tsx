"use client"

import Link from "next/link"
import { Bell, Building2, MessageSquareWarning, ShieldCheck } from "lucide-react"
import { AccountMenu } from "@/components/auth/account-menu"
import { mockAdminNotifications, mockAdminOperator } from "@/components/admin/admin-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminTopbar({ pathname }: { pathname: string }) {
  const unreadNotifications = mockAdminNotifications.length
  const notificationIconMap = {
    claim: ShieldCheck,
    review: MessageSquareWarning,
    business: Building2,
  } as const

  return (
    <header className="sticky top-0 z-40 border-b border-brand-deep-green/10 bg-white/88 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger
            className="h-9 w-9 rounded-full border border-brand-deep-green/10 bg-white text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] hover:bg-brand-soft-beige/45"
            aria-label="Open admin navigation"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Open admin notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-deep-green/10 bg-white text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-colors hover:border-brand-deep-green/18 hover:bg-brand-soft-beige/45"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                    {unreadNotifications}
                  </span>
                ) : null}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[22rem] rounded-[1.25rem] border-brand-deep-green/10 bg-white p-2 shadow-[0_18px_40px_rgba(10,70,53,0.12)]">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="font-semibold text-brand-dark-green">Admin notifications</p>
                <p className="mt-1 text-xs text-muted-foreground">Claims, moderation, and business issues that need eyes now.</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockAdminNotifications.map((item) => {
                const Icon = notificationIconMap[item.kind]
                return (
                  <DropdownMenuItem key={item.id} asChild className="rounded-xl px-3 py-3">
                    <Link href={item.href} className="items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft-beige/70 text-brand-dark-green">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-brand-dark-green">{item.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.subtitle}</span>
                        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{item.when}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <AccountMenu
            fallbackUser={{ name: mockAdminOperator.name, avatarUrl: mockAdminOperator.avatarUrl, href: "/profile" }}
            scope="admin"
            className="inline-flex items-center gap-2 rounded-full border border-brand-deep-green/10 bg-white px-2 py-2 text-sm font-semibold text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-colors hover:border-brand-deep-green/18 hover:bg-brand-soft-beige/45 sm:gap-3 sm:px-3"
          />
        </div>
      </div>
    </header>
  )
}

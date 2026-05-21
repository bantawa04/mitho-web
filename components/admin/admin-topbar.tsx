"use client"

import { AccountMenu } from "@/components/auth/account-menu"
import { mockAdminOperator } from "@/components/admin/admin-data"
import { getActiveAdminItem } from "@/components/admin/admin-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminTopbar({ pathname }: { pathname: string }) {
  const activeItem = getActiveAdminItem(pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-brand-deep-green/10 bg-white/88 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger
            className="h-9 w-9 rounded-full border border-brand-deep-green/10 bg-white text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] hover:bg-brand-soft-beige/45"
            aria-label="Open admin navigation"
          />

          <div className="min-w-0">
            <p className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">Admin</p>
            <p className="truncate text-base font-semibold text-brand-dark-green sm:text-lg">{activeItem.label}</p>
          </div>
        </div>

        <AccountMenu
          fallbackUser={{ name: mockAdminOperator.name, avatarUrl: mockAdminOperator.avatarUrl, href: "/profile" }}
          scope="admin"
          className="inline-flex items-center gap-2 rounded-full border border-brand-deep-green/10 bg-white px-2 py-2 text-sm font-semibold text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-colors hover:border-brand-deep-green/18 hover:bg-brand-soft-beige/45 sm:gap-3 sm:px-3"
        />
      </div>
    </header>
  )
}

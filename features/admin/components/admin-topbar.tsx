"use client"

import { AccountMenu } from "@/features/auth/components/account-menu"
import { mockAdminOperator } from "@/features/admin/data/admin-data"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminTopbar({ pathname }: { pathname: string }) {
  void pathname

  return (
    <header className="sticky top-0 z-40 border-b border-brand-deep-green/10 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger
            className="h-9 w-9 rounded-full border border-brand-deep-green/10 bg-white text-brand-dark-green shadow-sm hover:bg-muted"
            aria-label="Open admin navigation"
          />
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell viewAllHref="/admin/notifications" />

          <AccountMenu
            fallbackUser={{ name: mockAdminOperator.name, avatarUrl: mockAdminOperator.avatarUrl, href: "/profile" }}
            scope="admin"
            className="inline-flex items-center gap-2 rounded-full border border-brand-deep-green/10 bg-white px-2 py-2 text-sm font-semibold text-brand-dark-green shadow-sm transition-colors hover:border-brand-deep-green/18 hover:bg-muted sm:gap-3 sm:px-3"
          />
        </div>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { Building2, Flag, LayoutDashboard, MessageSquareWarning, ShieldCheck, Users } from "lucide-react"
import { AccountMenu } from "@/components/auth/account-menu"
import { mockAdminOperator } from "@/components/admin/admin-data"
import { cn } from "@/lib/utils"

const adminNavSections = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard home", icon: LayoutDashboard }],
  },
  {
    label: "Moderation queues",
    items: [
      { href: "/admin/business-claims", label: "Business claims", icon: ShieldCheck },
      { href: "/admin/reviews/moderation", label: "Review moderation", icon: MessageSquareWarning },
      { href: "/admin/reported-content", label: "Reported content", icon: Flag },
    ],
  },
  {
    label: "Directory",
    items: [
      { href: "/admin/businesses", label: "Businesses", icon: Building2 },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-deep-green/10 bg-white/88 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">Mitho admin</p>
            <p className="mt-1 text-sm text-muted-foreground">Moderation, claims, and trust operations</p>
          </div>
          <AccountMenu
            fallbackUser={{ name: mockAdminOperator.name, avatarUrl: mockAdminOperator.avatarUrl, href: "/profile" }}
            className="inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white px-3 py-2 text-sm font-semibold text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-colors hover:border-brand-deep-green/18 hover:bg-brand-soft-beige/45"
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[1.8rem] surface-admin-panel p-5">
              {adminNavSections.map((section) => (
                <div key={section.label} className="mb-6 last:mb-0">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep-green/55">{section.label}</p>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-brand-dark-green text-white shadow-[0_12px_24px_rgba(10,70,53,0.16)]"
                              : "text-brand-dark-green hover:bg-white/75",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

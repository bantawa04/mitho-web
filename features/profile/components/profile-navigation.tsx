"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const profileNavItems = [
  { href: "/profile", label: "Overview" },
  { href: "/feed", label: "Feed" },
  { href: "/profile/reviews", label: "My reviews" },
  { href: "/profile/following", label: "Following" },
  { href: "/collections", label: "Collections" },
  { href: "/profile/settings", label: "Account settings" },
]

export function ProfileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="overflow-x-auto pb-1" aria-label="Profile sections">
      <div className="flex min-w-max gap-2">
        {profileNavItems.map((item) => {
          const isCollectionsItem = item.href === "/collections"
          const isActive = isCollectionsItem ? pathname.startsWith("/collections") : pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-brand-orange/20 bg-brand-orange/10 text-brand-dark-green"
                  : "border-brand-deep-green/10 bg-white text-muted-foreground hover:border-brand-deep-green/18 hover:text-brand-dark-green",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

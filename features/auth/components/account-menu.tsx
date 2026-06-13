"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bookmark, Building2, LayoutDashboard, LogOut, Settings, User, Users } from "lucide-react"
import { useAuthSnapshot, useLogout } from "@/hooks/use-auth-session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AccountMenuProps {
  fallbackUser?: {
    name: string
    avatarUrl?: string
    href?: string
  } | null
  className?: string
  scope?: "default" | "admin"
}

export function AccountMenu({ fallbackUser, className, scope = "default" }: AccountMenuProps) {
  const router = useRouter()
  const { currentUser, hasBusinessAccess, isAuthenticated, isHydrated, isAdmin } = useAuthSnapshot()
  const logout = useLogout()

  const effectiveUser =
    isHydrated ? (isAuthenticated ? currentUser : null) : fallbackUser

  const effectiveHasBusinessAccess = isHydrated ? hasBusinessAccess : false
  // Internal users (admin / superadmin / custom staff role) get a stripped menu
  // even on public pages: just Dashboard + Account settings.
  const isInternal = isHydrated && isAdmin
  const settingsHref = scope === "admin" || isInternal ? "/admin/settings" : "/profile/settings"
  const menuSubtitle =
    scope === "admin" || isInternal
      ? "Internal Mitho admin access"
      : "Same Mitho account across customer and business tools"

  if (!effectiveUser) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={className ?? "inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white px-3 py-2 text-sm font-semibold text-brand-dark-green shadow-sm transition-colors hover:border-brand-deep-green/18 hover:bg-muted"}
          aria-label="Open account menu"
        >
          <img
            src={effectiveUser.avatarUrl || "/placeholder.svg"}
            alt={effectiveUser.name}
            className="h-8 w-8 rounded-full border border-brand-soft-beige object-cover"
          />
          <span className="hidden max-w-[10rem] truncate sm:inline">{effectiveUser.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl border-brand-deep-green/10 bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <img
              src={effectiveUser.avatarUrl || "/placeholder.svg"}
              alt={effectiveUser.name}
              className="h-10 w-10 rounded-full border border-brand-soft-beige object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-brand-dark-green">{effectiveUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{menuSubtitle}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isInternal ? (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          ) : scope === "default" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/collections">
                  <Bookmark className="h-4 w-4" />
                  Collections
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/following">
                  <Users className="h-4 w-4" />
                  Following
                </Link>
              </DropdownMenuItem>
              {effectiveHasBusinessAccess ? (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/businesses">
                    <Building2 className="h-4 w-4" />
                    Manage businesses
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </>
          ) : null}
          <DropdownMenuItem asChild>
            <Link href={settingsHref}>
              <Settings className="h-4 w-4" />
              Account settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={async (event) => {
            event.preventDefault()
            await logout.mutateAsync()
            router.push("/")
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

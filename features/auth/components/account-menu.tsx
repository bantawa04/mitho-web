"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bookmark, Building2, LogOut, Settings, User, Users } from "lucide-react"
import { useMockAuth } from "@/features/auth/components/mock-auth-provider"
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
  const { currentUser, hasBusinessAccess, isAuthenticated, isHydrated, signOut } = useMockAuth()

  const effectiveUser =
    isHydrated ? (isAuthenticated ? currentUser : null) : fallbackUser

  const effectiveHasBusinessAccess = isHydrated ? hasBusinessAccess : Boolean(fallbackUser)
  const settingsHref = scope === "admin" ? "/admin/settings" : "/profile/settings"
  const menuSubtitle =
    scope === "admin"
      ? "Internal Mitho admin access"
      : "Same Mitho account across customer and business tools"

  if (!effectiveUser) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={className ?? "inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white/88 px-3 py-2 text-sm font-semibold text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.06)] transition-colors hover:border-brand-deep-green/18 hover:bg-brand-soft-beige/45"}
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
        className="w-64 rounded-[1.25rem] border-brand-deep-green/10 bg-white p-2 shadow-[0_18px_40px_rgba(10,70,53,0.12)]"
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
          {scope === "default" ? (
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
          ) : null}
          {scope === "default" ? (
            <>
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
          onSelect={(event) => {
            event.preventDefault()
            signOut()
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

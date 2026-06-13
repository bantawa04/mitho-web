"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { AccountMenu } from "@/features/auth/components/account-menu"
import { useAuthSnapshot, useLogout } from "@/hooks/use-auth-session"
import { cn } from "@/lib/utils"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { MithoButton } from "@/components/mitho/mitho-button"
import { BrandLogo } from "@/components/mitho/brand-logo"
import { headerNavLinks } from "@/features/home/data/header-nav-links"

interface HeaderProps {
  signedInUser?: {
    name: string
    avatarUrl?: string
    href?: string
  }
}

export function Header({ signedInUser }: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, isAuthenticated, isHydrated, hasBusinessAccess, isAdmin } = useAuthSnapshot()
  const logout = useLogout()

  const effectiveUser = isHydrated ? (isAuthenticated ? currentUser : null) : signedInUser
  const effectiveHasBusinessAccess = isHydrated ? hasBusinessAccess : false
  const isInternalUser = isHydrated && isAdmin

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openSignInModal = () => {
    setIsMenuOpen(false)
    setIsSignInOpen(true)
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-brand-deep-green/10 bg-background transition-all duration-200",
          isScrolled ? "shadow-sm" : "shadow-none",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <BrandLogo
                kind="full"
                tone="green"
                className="h-9 w-auto sm:h-11"
                alt="Mitho Cha! wordmark"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {headerNavLinks.map((link) => {
                if (link.subLinks) {
                  return (
                    <DropdownMenu key={link.label}>
                      <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground">
                        {link.label}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-lg border-brand-deep-green/10 p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                        {link.subLinks.map((subLink) => (
                          <DropdownMenuItem key={subLink.label} asChild className="cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium focus:bg-muted focus:text-foreground">
                            <Link href={subLink.href}>{subLink.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }

                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.label}
                    href={link.href!}
                    className={cn(
                      "px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:underline underline-offset-8 transition-colors",
                      isActive && "text-foreground font-semibold underline underline-offset-8 decoration-2 decoration-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {effectiveUser ? (
                <div className="hidden lg:block">
                  <AccountMenu fallbackUser={signedInUser} />
                </div>
              ) : (
                <MithoButton variant="primary" size="sm" className="hidden lg:inline-flex" onClick={openSignInModal}>
                  Sign in
                </MithoButton>
              )}

              <button
                className="rounded-full p-2 transition-colors hover:bg-brand-soft-beige/50 lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent side="left" className="w-[300px] overflow-y-auto p-0 sm:w-[340px] lg:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col px-2 pb-6 pt-10">
              <nav className="space-y-1">
                {headerNavLinks.map((link) => {
                  if (link.subLinks) {
                    return (
                      <div key={link.label} className="py-2">
                        <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-deep-green/50">
                          {link.label}
                        </p>
                        <div className="mt-1 space-y-1">
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.label}
                              href={subLink.href}
                              className="block rounded-md px-4 py-3 pl-6 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={link.label}
                      href={link.href!}
                      className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-brand-deep-green/10 pt-4">
                {effectiveUser ? (
                  <>
                    <Link
                      href={effectiveUser.href ?? "/profile"}
                      className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark-green"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img
                        src={effectiveUser.avatarUrl || "/placeholder.svg"}
                        alt={effectiveUser.name}
                        className="h-10 w-10 rounded-full border border-brand-soft-beige object-cover"
                      />
                      <span className="truncate">{effectiveUser.name}</span>
                    </Link>
                    {isInternalUser ? (
                      <Link
                        href="/admin"
                        className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/collections"
                          className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Collections
                        </Link>
                        <Link
                          href="/profile/following"
                          className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Following
                        </Link>
                        {effectiveHasBusinessAccess ? (
                          <Link
                            href="/dashboard/businesses"
                            className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Manage businesses
                          </Link>
                        ) : null}
                      </>
                    )}
                    <Link
                      href={isInternalUser ? "/admin/settings" : "/profile/settings"}
                      className="block rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account settings
                    </Link>
                    <MithoButton
                      variant="outline-secondary"
                      className="w-full border-danger/20 text-danger hover:bg-danger/10 hover:text-danger"
                      onClick={async () => {
                        setIsMenuOpen(false)
                        await logout.mutateAsync()
                        router.push("/")
                      }}
                    >
                      Log out
                    </MithoButton>
                  </>
                ) : (
                  <MithoButton variant="primary" className="w-full" onClick={openSignInModal}>
                    Sign in
                  </MithoButton>
                )}
                <MithoButton variant="outline-secondary" className="w-full" asChild>
                  <Link href={pathname === "/" ? "#app" : "/#app"} onClick={() => setIsMenuOpen(false)}>
                    Get the app
                  </Link>
                </MithoButton>
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onContinue={() => {
          setIsSignInOpen(false)
        }}
      />
    </>
  )
}

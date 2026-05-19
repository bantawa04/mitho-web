"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { AccountMenu } from "@/components/auth/account-menu"
import { useMockAuth } from "@/components/auth/mock-auth-provider"
import { cn } from "@/lib/utils"
import { GoogleSignInDialog } from "@/components/auth/google-sign-in-dialog"
import { MithoButton } from "@/components/ui/mitho-button"
import { BrandLogo } from "@/components/ui/brand-logo"

const navLinks = [
  { href: "/users/aaratieats", label: "Reviews" },
  { href: "/explore", label: "Trending" },
  { href: "/cities/kathmandu", label: "Nearby" },
  { href: "/categories/restaurants", label: "Cravings" },
  { href: "/business/claim", label: "For Business" },
]

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
  const { currentUser, isAuthenticated, isHydrated, signIn, signOut, hasBusinessAccess } = useMockAuth()

  const effectiveUser = isHydrated ? (isAuthenticated ? currentUser : null) : signedInUser
  const effectiveHasBusinessAccess = isHydrated ? hasBusinessAccess : Boolean(signedInUser)

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
          "sticky top-0 z-50 w-full border-b border-brand-deep-green/10 bg-background/88 backdrop-blur-md transition-all duration-200",
          isScrolled ? "shadow-[0_8px_26px_rgba(10,70,53,0.08)]" : "shadow-none",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <BrandLogo kind="icon" tone="green" className="h-10 w-auto sm:hidden" alt="Mitho Cha! logo" priority />
              <BrandLogo
                kind="full"
                tone="green"
                className="hidden h-11 w-auto sm:block"
                alt="Mitho Cha! wordmark"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/78 transition-colors hover:bg-brand-soft-beige/60 hover:text-brand-orange"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {effectiveUser ? (
                <div className="hidden sm:block">
                  <AccountMenu fallbackUser={signedInUser} />
                </div>
              ) : (
                <MithoButton variant="primary" size="sm" className="hidden sm:inline-flex" onClick={openSignInModal}>
                  Sign in
                </MithoButton>
              )}

              <button
                className="rounded-full p-2 transition-colors hover:bg-brand-soft-beige/50 lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="border-t border-brand-deep-green/10 bg-background/98 py-4 lg:hidden">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-brand-deep-green/10 pt-4">
                {effectiveUser ? (
                  <>
                    <Link
                      href={effectiveUser.href ?? "/profile"}
                      className="flex items-center gap-3 rounded-[1.2rem] border border-brand-deep-green/10 bg-white px-4 py-3 text-sm font-semibold text-brand-dark-green shadow-[0_10px_24px_rgba(10,70,53,0.05)]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img
                        src={effectiveUser.avatarUrl || "/placeholder.svg"}
                        alt={effectiveUser.name}
                        className="h-10 w-10 rounded-full border border-brand-soft-beige object-cover"
                      />
                      <span className="truncate">{effectiveUser.name}</span>
                    </Link>
                    <Link
                      href="/collections"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Collections
                    </Link>
                    <Link
                      href="/profile/following"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Following
                    </Link>
                    {effectiveHasBusinessAccess ? (
                      <Link
                        href="/dashboard/businesses"
                        className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manage businesses
                      </Link>
                    ) : null}
                    <Link
                      href="/profile/settings"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft-beige/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account settings
                    </Link>
                    <MithoButton
                      variant="outline-secondary"
                      className="w-full border-danger/20 text-danger hover:bg-danger/10 hover:text-danger"
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut()
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
          )}
        </div>
      </header>

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onContinue={() => {
          signIn()
          setIsSignInOpen(false)
        }}
      />
    </>
  )
}

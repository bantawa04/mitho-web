"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoButton } from "@/components/ui/mitho-button"
import { BrandLogo } from "@/components/ui/brand-logo"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const navLinks = [
  { href: "/#reviews", label: "Reviews" },
  { href: "/#trending", label: "Trending" },
  { href: "/#nearby", label: "Nearby" },
  { href: "/#categories", label: "Cravings" },
  { href: "/#for-business", label: "For Business" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const pathname = usePathname()

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
              <MithoButton variant="primary" size="sm" className="hidden sm:inline-flex" onClick={openSignInModal}>
                <LogIn className="h-4 w-4" />
                Sign in
              </MithoButton>

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
                <MithoButton variant="primary" className="w-full" onClick={openSignInModal}>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </MithoButton>
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

      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-[1.75rem] border-brand-deep-green/10 bg-white p-0 shadow-[0_22px_60px_rgba(10,70,53,0.14)] sm:max-w-[520px]">
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-brand-dark-green">
              <BrandLogo kind="icon" tone="green" className="h-6 w-auto" alt="Mitho Cha! icon" />
              Google sign-in
            </div>
            <DialogHeader className="mt-5 text-left">
              <DialogTitle className="type-section-title text-brand-dark-green">
                Sign in once and keep the same Mitho account for everything.
              </DialogTitle>
              <DialogDescription className="mt-3 text-base leading-7 text-muted-foreground">
                Use Google to review places, save shortlists, submit listings, and later manage a business without a
                second account.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-7">
            <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
              <p className="text-sm leading-7 text-muted-foreground">
                For now, Mitho uses Google sign-in only. Once the real auth hook is connected, this same modal will be
                the entry point for login and signup.
              </p>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-brand-deep-green/12 bg-white px-5 py-3.5 text-sm font-semibold text-brand-dark-green shadow-[0_8px_22px_rgba(10,70,53,0.05)] transition-colors hover:bg-brand-soft-beige/45"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.5l2.7-2.7C17 2.7 14.8 1.8 12 1.8 6.9 1.8 2.8 6 2.8 11.2S6.9 20.6 12 20.6c6.9 0 8.6-4.8 8.6-7.2 0-.5-.1-.9-.1-1.2H12Z" />
                  <path fill="#34A853" d="M2.8 11.2c0 1.7.6 3.3 1.7 4.5l3-2.3c-.4-.6-.6-1.4-.6-2.2s.2-1.5.6-2.2l-3-2.3c-1.1 1.2-1.7 2.8-1.7 4.5Z" />
                  <path fill="#FBBC05" d="M12 20.6c2.8 0 5.1-.9 6.8-2.5l-3.2-2.6c-.9.7-2.1 1.2-3.6 1.2-2.5 0-4.6-1.7-5.4-4l-3.1 2.4c1.8 3.3 5.1 5.5 8.5 5.5Z" />
                  <path fill="#4285F4" d="M18.8 18.1c1.9-1.7 2.8-4.1 2.8-6.9 0-.5-.1-.9-.1-1.2H12v3.9h5.5c-.2 1.1-.9 2.7-2.7 3.9l4 3.1Z" />
                </svg>
              </span>
              Continue with Google
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

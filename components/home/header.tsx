"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoButton } from "@/components/ui/mitho-button"
import { BrandLogo } from "@/components/ui/brand-logo"

const navLinks = [
  { href: "#reviews", label: "Reviews" },
  { href: "#trending", label: "Trending" },
  { href: "#nearby", label: "Nearby" },
  { href: "#categories", label: "Cravings" },
  { href: "#for-business", label: "For Business" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
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
            <MithoButton variant="primary" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="#for-business">Add Business</Link>
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
              <MithoButton variant="primary" className="w-full" asChild>
                <Link href="#for-business" onClick={() => setIsMenuOpen(false)}>
                  Add Business
                </Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" className="w-full" asChild>
                <Link href="#app" onClick={() => setIsMenuOpen(false)}>
                  Get the app
                </Link>
              </MithoButton>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

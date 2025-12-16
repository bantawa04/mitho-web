"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoButton } from "@/components/ui/mitho-button"

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/cities", label: "Cities" },
  { href: "/categories", label: "Categories" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/for-business", label: "For Business" },
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
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange shadow-md">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-brand-dark-green hidden sm:block">Mitho Cha!</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 transition-colors hover:text-brand-orange hover:bg-brand-soft-beige/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MithoButton variant="primary" size="sm" className="hidden sm:inline-flex">
              Add Business
            </MithoButton>
            <div className="hidden md:flex items-center gap-2">
              <MithoButton variant="ghost" size="sm">
                Login
              </MithoButton>
              <MithoButton variant="secondary" size="sm">
                Sign Up
              </MithoButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-brand-soft-beige/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-brand-soft-beige/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <MithoButton variant="primary" className="w-full">
                Add Business
              </MithoButton>
              <div className="flex gap-2">
                <MithoButton variant="ghost" size="sm" className="flex-1">
                  Login
                </MithoButton>
                <MithoButton variant="secondary" size="sm" className="flex-1">
                  Sign Up
                </MithoButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

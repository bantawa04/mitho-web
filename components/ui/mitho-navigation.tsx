"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, User, MapPin, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoButton } from "./mitho-button"
import { MithoSearchInput } from "./mitho-input"

// Top Navbar (Web)
interface NavbarProps {
  className?: string
}

export function MithoNavbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/food-trucks", label: "Food Trucks" },
    { href: "/saved", label: "Saved" },
  ]

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-brand-dark-green">Mitho Cha!</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <MithoSearchInput />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-brand-soft-beige text-brand-dark-green"
                    : "text-muted-foreground hover:bg-brand-soft-beige/50 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <MithoButton variant="ghost" size="sm">
              Sign In
            </MithoButton>
            <MithoButton size="sm">Sign Up</MithoButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-brand-soft-beige/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="mb-4">
              <MithoSearchInput />
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-brand-soft-beige text-brand-dark-green"
                      : "text-muted-foreground hover:bg-brand-soft-beige/50",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <MithoButton variant="ghost" size="sm" className="flex-1">
                Sign In
              </MithoButton>
              <MithoButton size="sm" className="flex-1">
                Sign Up
              </MithoButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Bottom Tab Bar (Mobile)
interface TabBarProps {
  className?: string
}

export function MithoTabBar({ className }: TabBarProps) {
  const pathname = usePathname()

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/nearby", icon: MapPin, label: "Nearby" },
    { href: "/saved", icon: Heart, label: "Saved" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden",
        className,
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-brand-orange" : "text-muted-foreground",
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "fill-brand-orange/20")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Breadcrumbs
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function MithoBreadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-muted-foreground hover:text-brand-orange transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

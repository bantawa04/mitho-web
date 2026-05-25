export interface HeaderNavLink {
  href: string
  label: string
}

export const headerNavLinks: HeaderNavLink[] = [
  { href: "/users", label: "Creators" },
  { href: "/explore", label: "Trending" },
  { href: "/cities/kathmandu", label: "Nearby" },
  { href: "/categories/restaurants", label: "Cravings" },
  { href: "/business/claim", label: "For Business" },
]

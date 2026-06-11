export interface HeaderNavLink {
  href?: string
  label: string
  subLinks?: { href: string; label: string }[]
}

export const headerNavLinks: HeaderNavLink[] = [
  { href: "#", label: "Where to Eat" },
  { href: "#", label: "Hidden Gems" },
  { href: "#", label: "Top Rated" },
  { 
    label: "For Owners",
    subLinks: [
      { href: "/add-business", label: "Add Business" },
      { href: "/business/claim", label: "Claim Business" },
    ]
  },
]

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"

const footerLinks = {
  discover: {
    title: "Discover",
    links: [
      { label: "Trending picks", href: "#trending" },
      { label: "Local reviews", href: "#reviews" },
      { label: "Nearby favorites", href: "#nearby" },
      { label: "Cravings", href: "#categories" },
    ],
  },
  forBusiness: {
    title: "For Business",
    links: [
      { label: "Claim your business", href: "#for-business" },
      { label: "Featured placement", href: "#partners" },
      { label: "Talk to the team", href: "#" },
    ],
  },
  product: {
    title: "Product",
    links: [
      { label: "Get the app", href: "#app" },
      { label: "Join the waitlist", href: "#" },
      { label: "Saved lists", href: "#" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Contact", href: "#" },
      { label: "Report a listing", href: "#" },
      { label: "Community guidelines", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-brand-dark-green text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex mb-4">
              <BrandLogo kind="full" tone="orange" className="h-20 w-auto" alt="Mitho Cha! logo" />
            </Link>
            <p className="text-sm text-white/70 mb-4">
              Discover trusted local food picks across Nepal, from neighborhood momo stops to places worth a longer ride.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                className="flex-1 h-10 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 transition-[border-color,box-shadow,background-color] focus:border-brand-orange focus:bg-white/12 focus:outline-none focus:ring-4 focus:ring-brand-orange/15 focus:shadow-[0_0_24px_rgba(239,138,0,0.18)]"
              />
              <button
                type="button"
                aria-label="Join the newsletter waitlist"
                className="h-10 rounded-lg bg-brand-orange px-4 transition-colors hover:bg-brand-fresh-orange"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">Serving food lovers across Nepal</p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} Mitho Cha! All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

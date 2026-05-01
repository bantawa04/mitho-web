import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react"
import { BrandLogo } from "@/components/ui/brand-logo"

const footerLinks = {
  discover: {
    title: "Discover",
    links: [
      { id: "discover-trending", label: "Trending picks", href: "#trending" },
      { id: "discover-reviews", label: "Local reviews", href: "#reviews" },
      { id: "discover-nearby", label: "Nearby favorites", href: "#nearby" },
      { id: "discover-cravings", label: "Cravings", href: "#categories" },
    ],
  },
  forBusiness: {
    title: "For Business",
    links: [
      { id: "business-claim", label: "Claim your business", href: "#for-business" },
      { id: "business-placement", label: "Featured placement", href: "#partners" },
      { id: "business-team", label: "Talk to the team", href: "#" },
    ],
  },
  product: {
    title: "Product",
    links: [
      { id: "product-app", label: "Get the app", href: "#app" },
      { id: "product-waitlist", label: "Join the waitlist", href: "#" },
      { id: "product-guidelines", label: "Community guidelines", href: "#" },
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
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex mb-4">
              <BrandLogo kind="full" tone="orange" className="h-20 w-auto" alt="Mitho Cha! logo" />
            </Link>
            <p className="mb-5 text-sm leading-7 text-white/72">
              Discover trusted local food picks across Nepal, from neighborhood momo stops to places worth a longer ride.
            </p>
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
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-orange"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/60">Serving food lovers across Nepal</p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} Mitho Cha! All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

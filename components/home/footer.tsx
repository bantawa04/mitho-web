import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react"

const footerLinks = {
  about: {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Mission", href: "/mission" },
      { label: "Contact", href: "/contact" },
    ],
  },
  discover: {
    title: "Discover",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Cities", href: "/cities" },
      { label: "Top Rated", href: "/top-rated" },
      { label: "Food Trucks", href: "/food-trucks" },
    ],
  },
  forBusiness: {
    title: "For Business",
    links: [
      { label: "List Business", href: "/list-business" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Advertise", href: "/advertise" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Guidelines", href: "/guidelines" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Report", href: "/report" },
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
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold">Mitho Cha!</span>
            </Link>
            <p className="text-sm text-white/70 mb-4">Discover authentic Nepali food experiences near you.</p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-brand-orange"
              />
              <button className="h-10 px-4 bg-brand-orange rounded-lg hover:bg-brand-fresh-orange transition-colors">
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

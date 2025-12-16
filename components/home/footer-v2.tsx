import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

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
  helpLegal: {
    title: "Help & Legal",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Report Issue", href: "/report" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Guidelines", href: "/guidelines" },
    ],
  },
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function FooterV2() {
  return (
    <footer className="bg-brand-dark-green text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold">Mitho Cha!</span>
            </Link>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              Discover authentic Nepali food experiences near you.
            </p>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="min-w-0">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} Mitho Cha! • Serving food lovers across Nepal
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:scale-110 transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

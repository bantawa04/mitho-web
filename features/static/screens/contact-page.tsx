import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { PageHero } from "@/features/static/components/page-hero"
import { ContactForm } from "@/features/static/components/contact-form"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"

const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
]

export function ContactPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <PageHero
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. We would love to hear from you — drop us a line and we'll get back to you."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* Left: info */}
            <div className="space-y-6">
              <div>
                <h2 className="type-section-title text-brand-dark-green">Get in touch</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              <MithoCard>
                <MithoCardContent className="space-y-5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark-green">Address</p>
                      <p className="text-sm leading-6 text-muted-foreground">Thamel, Kathmandu 44600, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark-green">Phone</p>
                      <p className="text-sm leading-6 text-muted-foreground">+977 1-4000000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark-green">Email</p>
                      <p className="text-sm leading-6 text-muted-foreground">hello@mithocha.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark-green">Opening hours</p>
                      <p className="text-sm leading-6 text-muted-foreground">Sun – Fri: 9:00 AM – 6:00 PM</p>
                      <p className="text-sm leading-6 text-muted-foreground">Saturday: Closed</p>
                    </div>
                  </div>
                </MithoCardContent>
              </MithoCard>

              {/* Social */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-brand-dark-green transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <MithoCard>
              <MithoCardContent className="p-6 md:p-8">
                <h2 className="type-section-title mb-1 text-brand-dark-green">Send us a message</h2>
                <p className="mb-6 text-sm leading-6 text-muted-foreground">
                  Fill out the form below and our placeholder team will reply soon.
                </p>
                <ContactForm />
              </MithoCardContent>
            </MithoCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

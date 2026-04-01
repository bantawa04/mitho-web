import { Clock, Globe, MapPin, Phone, UtensilsCrossed } from "lucide-react"
import { AmenityList } from "@/components/ui/mitho-amenity"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle, MithoCardDescription } from "@/components/ui/mitho-card"
import { MithoImageGallery } from "@/components/ui/mitho-image-gallery"

const galleryItems = [
  { type: "image" as const, src: "/restaurant-interior-cozy.jpg", alt: "Restaurant interior" },
  { type: "image" as const, src: "/nepali-momo-dish.jpg", alt: "Steamed momo platter" },
  { type: "image" as const, src: "/newari-food-platter.jpg", alt: "Newari food platter" },
  { type: "image" as const, src: "/restaurant-exterior-storefront.jpg", alt: "Restaurant exterior" },
  { type: "image" as const, src: "/chef-cooking-nepali-food.jpg", alt: "Chef preparing food" },
]

const businessInfo = {
  address: "123 Thamel Street, Kathmandu 44600, Nepal",
  phone: "+977 1-4234567",
  website: "www.himalayanflavors.com",
  email: "info@himalayanflavors.com",
  hours: [
    { day: "Monday - Friday", time: "10:00 AM - 10:00 PM" },
    { day: "Saturday - Sunday", time: "9:00 AM - 11:00 PM" },
  ],
  cuisines: ["Nepali", "Tibetan", "Indian"],
  amenities: ["wifi", "parking", "takeaway", "cards", "dineIn", "vegan"] as const,
}

const visitFacts = [
  {
    icon: <MapPin className="h-5 w-5 text-brand-orange" />,
    label: "Address",
    content: businessInfo.address,
  },
  {
    icon: <Clock className="h-5 w-5 text-brand-orange" />,
    label: "Hours",
    content: businessInfo.hours.map((schedule) => `${schedule.day}: ${schedule.time}`).join(" • "),
  },
  {
    icon: <Phone className="h-5 w-5 text-brand-orange" />,
    label: "Contact",
    content: `${businessInfo.phone} • ${businessInfo.email}`,
  },
  {
    icon: <UtensilsCrossed className="h-5 w-5 text-brand-orange" />,
    label: "Cuisine",
    content: businessInfo.cuisines.join(", "),
  },
]

export function InfoPanel() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="type-eyebrow text-brand-deep-green/70">Plan your visit</p>
        <h2 className="type-section-title mt-3 text-brand-dark-green">What to know before you go</h2>
        <p className="type-body mt-3 text-muted-foreground">
          Quick details for deciding if this spot fits tonight&apos;s plan: a feel for the place, practical info, and
          the amenities people care about most.
        </p>
      </div>

      <div className="space-y-6">
        <MithoCard surface="spotlight" interactive="none" className="overflow-hidden">
          <MithoCardContent className="p-4 md:p-5">
            <MithoImageGallery items={galleryItems} className="pb-0" />
          </MithoCardContent>
        </MithoCard>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <MithoCard surface="customer" interactive="none">
            <MithoCardHeader className="pb-4">
              <MithoCardTitle>Visit essentials</MithoCardTitle>
              <MithoCardDescription className="mt-2 leading-relaxed">
                The practical details most people want before heading out.
              </MithoCardDescription>
            </MithoCardHeader>
            <MithoCardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {visitFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[1.35rem] border border-brand-deep-green/10 bg-surface-inset p-4"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10">
                      {fact.icon}
                    </div>
                    <p className="text-sm font-semibold text-brand-dark-green">{fact.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fact.content}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-brand-soft-beige/40 p-4">
                <p className="text-sm font-semibold text-brand-dark-green">Amenities people often look for</p>
                <AmenityList amenities={[...businessInfo.amenities]} className="mt-3" />
              </div>
            </MithoCardContent>
          </MithoCard>

          <div className="space-y-6">
            <MithoCard surface="customer" interactive="none" className="overflow-hidden">
              <MithoCardHeader className="pb-4">
                <MithoCardTitle>Find it easily</MithoCardTitle>
                <MithoCardDescription className="mt-2">Close to the heart of Thamel and easy to share with friends.</MithoCardDescription>
              </MithoCardHeader>
              <MithoCardContent>
                <div className="overflow-hidden rounded-[1.5rem] border border-brand-deep-green/10">
                  <img
                    src="/map-kathmandu-thamel-location-pin.jpg"
                    alt="Map location"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <a
                  href={`https://${businessInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
                >
                  <Globe className="h-4 w-4" />
                  Open website and directions
                </a>
              </MithoCardContent>
            </MithoCard>

            <MithoCard surface="inset" interactive="none">
              <MithoCardContent className="p-5">
                <p className="type-eyebrow text-brand-deep-green/70">Good to know</p>
                <p className="mt-3 text-lg font-semibold text-brand-dark-green">
                  Best for casual dinners, comforting plates, and taking out-of-town friends somewhere dependable.
                </p>
              </MithoCardContent>
            </MithoCard>
          </div>
        </div>
      </div>
    </section>
  )
}

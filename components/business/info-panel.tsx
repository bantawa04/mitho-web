import { MapPin, Clock, UtensilsCrossed, DollarSign, Phone, Globe } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { AmenityList } from "@/components/ui/mitho-amenity"

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
  priceRange: "$$",
  amenities: ["wifi", "parking", "takeaway", "cards", "dineIn", "vegan"] as const,
}

export function InfoPanel() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <MithoCard>
            <MithoCardHeader>
              <h2 className="text-xl font-bold">Business Information</h2>
            </MithoCardHeader>
            <MithoCardContent className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground text-sm">{businessInfo.address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Opening Hours</p>
                  {businessInfo.hours.map((schedule, index) => (
                    <p key={index} className="text-muted-foreground text-sm">
                      {schedule.day}: {schedule.time}
                    </p>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Cuisine</p>
                  <p className="text-muted-foreground text-sm">{businessInfo.cuisines.join(", ")}</p>
                </div>
              </div>

              {/* Price Range */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Price Range</p>
                  <p className="text-muted-foreground text-sm">{businessInfo.priceRange} - Moderate</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-muted-foreground text-sm">{businessInfo.phone}</p>
                  <p className="text-muted-foreground text-sm">{businessInfo.email}</p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <a
                    href={`https://${businessInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-orange hover:underline text-sm"
                  >
                    {businessInfo.website}
                  </a>
                </div>
              </div>
            </MithoCardContent>
          </MithoCard>

          {/* Amenities */}
          <MithoCard>
            <MithoCardHeader>
              <h2 className="text-xl font-bold">Amenities</h2>
            </MithoCardHeader>
            <MithoCardContent>
              <AmenityList amenities={[...businessInfo.amenities]} />
            </MithoCardContent>
          </MithoCard>
        </div>

        {/* Map Preview */}
        <div className="lg:col-span-1">
          <MithoCard className="h-full">
            <MithoCardHeader>
              <h2 className="text-xl font-bold">Location</h2>
            </MithoCardHeader>
            <MithoCardContent>
              <div className="aspect-square rounded-xl overflow-hidden bg-brand-soft-beige/30 flex items-center justify-center">
                <img src="/map-kathmandu-thamel-location-pin.jpg" alt="Map location" className="w-full h-full object-cover" />
              </div>
              <a href="#" className="block text-center text-brand-orange hover:underline mt-4 text-sm font-medium">
                Get Directions
              </a>
            </MithoCardContent>
          </MithoCard>
        </div>
      </div>
    </section>
  )
}

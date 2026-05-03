import { Clock, Globe, MapPin, Phone, UtensilsCrossed } from "lucide-react"
import { AmenityList } from "@/components/ui/mitho-amenity"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle, MithoCardDescription } from "@/components/ui/mitho-card"
import { BusinessGalleryPreview } from "@/components/business/business-gallery-preview"
import type { BusinessGalleryItem, BusinessVisitInfo } from "@/components/business/business-detail-types"

interface InfoPanelProps {
  galleryItems: BusinessGalleryItem[]
  galleryTotalCount?: number
  galleryEmptyMessage?: string
  visitInfo: BusinessVisitInfo
}

export function InfoPanel({ galleryItems, galleryTotalCount, galleryEmptyMessage, visitInfo }: InfoPanelProps) {
  const contactLine = [visitInfo.phone, visitInfo.email].filter(Boolean).join(" • ") || "Contact details not listed yet"
  const hoursLine =
    visitInfo.hours.length > 0
      ? visitInfo.hours.map((schedule) => `${schedule.day}: ${schedule.time}`).join(" • ")
      : "Hours not listed yet"
  const cuisineLine = visitInfo.cuisines.length > 0 ? visitInfo.cuisines.join(", ") : "Cuisine details coming soon"

  const visitFacts = [
    {
      icon: <MapPin className="h-5 w-5 text-brand-orange" />,
      label: "Address",
      content: visitInfo.address,
    },
    {
      icon: <Clock className="h-5 w-5 text-brand-orange" />,
      label: "Hours",
      content: hoursLine,
    },
    {
      icon: <Phone className="h-5 w-5 text-brand-orange" />,
      label: "Contact",
      content: contactLine,
    },
    {
      icon: <UtensilsCrossed className="h-5 w-5 text-brand-orange" />,
      label: "Cuisine",
      content: cuisineLine,
    },
  ]

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
            <BusinessGalleryPreview
              items={galleryItems}
              totalCount={galleryTotalCount}
              emptyMessage={galleryEmptyMessage}
            />
          </MithoCardContent>
        </MithoCard>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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
                    className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white/88 p-4"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
                      {fact.icon}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/72">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fact.content}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-brand-soft-beige/40 p-4">
                <p className="text-sm font-semibold text-brand-dark-green">Amenities people often look for</p>
                <AmenityList amenities={[...visitInfo.amenities]} className="mt-3" />
              </div>
            </MithoCardContent>
          </MithoCard>

          <div className="space-y-6">
            <MithoCard surface="customer" interactive="none" className="overflow-hidden">
              <MithoCardHeader className="pb-4">
                <MithoCardTitle>Find it easily</MithoCardTitle>
                <MithoCardDescription className="mt-2">{visitInfo.mapDescription}</MithoCardDescription>
              </MithoCardHeader>
              <MithoCardContent>
                <div className="overflow-hidden rounded-[1.5rem] border border-brand-deep-green/10">
                  <img
                    src={visitInfo.mapImage}
                    alt="Map location"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                {visitInfo.website && (
                  <a
                    href={`https://${visitInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-deep-green/10 bg-brand-soft-beige/45 px-4 py-2 text-sm font-semibold text-brand-deep-green transition-colors hover:border-brand-orange/30 hover:text-brand-orange"
                  >
                    <Globe className="h-4 w-4" />
                    {visitInfo.mapLinkText ?? "Open website and directions"}
                  </a>
                )}
              </MithoCardContent>
            </MithoCard>

            <MithoCard surface="inset" interactive="none">
              <MithoCardContent className="p-5">
                <p className="type-eyebrow text-brand-deep-green/70">Good to know</p>
                <p className="mt-3 text-lg font-semibold text-brand-dark-green">{visitInfo.goodToKnow}</p>
              </MithoCardContent>
            </MithoCard>
          </div>
        </div>
      </div>
    </section>
  )
}

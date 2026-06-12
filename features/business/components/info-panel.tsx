import { StaticMap } from "@vis.gl/react-google-maps"
import { Clock, Globe, MapPin, Navigation, Phone, UtensilsCrossed } from "lucide-react"
import { AmenityList } from "@/components/mitho/mitho-amenity"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle, MithoCardDescription } from "@/components/mitho/mitho-card"
import { BusinessGalleryPreview } from "@/features/business/components/business-gallery-preview"
import { createBusinessStaticMapUrl, createGoogleDirectionsUrl } from "@/lib/google-maps"
import type { BusinessGalleryItem, BusinessVisitInfo } from "@/features/business/business-detail-types"

interface InfoPanelProps {
  isEarlyListing?: boolean
  galleryItems: BusinessGalleryItem[]
  galleryTotalCount?: number
  galleryEmptyMessage?: string
  visitInfo: BusinessVisitInfo
}

export function InfoPanel({
  isEarlyListing = false,
  galleryItems,
  galleryTotalCount,
  galleryEmptyMessage,
  visitInfo,
}: InfoPanelProps) {
  const contactLine = [visitInfo.phone, visitInfo.email].filter(Boolean).join(" • ") || "Contact details not listed yet"
  const hoursLine =
    visitInfo.hours.length > 0
      ? visitInfo.hours.map((schedule) => `${schedule.day}: ${schedule.time}`).join(" • ")
      : "Hours not listed yet"
  const cuisineLine = visitInfo.cuisines.length > 0 ? visitInfo.cuisines.join(", ") : "Cuisine details coming soon"
  const staticMapUrl = visitInfo.coordinates
    ? createBusinessStaticMapUrl({
        coordinates: visitInfo.coordinates,
        zoom: visitInfo.mapZoom ?? 15,
      })
    : null
  const directionsUrl = visitInfo.coordinates ? createGoogleDirectionsUrl(visitInfo.coordinates) : null
  const websiteUrl = visitInfo.website ? normalizeExternalUrl(visitInfo.website) : null

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

      <div className="space-y-8">
        <div className="-mx-4 sm:mx-0">
          <BusinessGalleryPreview
            items={galleryItems}
            totalCount={galleryTotalCount}
            emptyTitle={isEarlyListing ? "No photos yet" : undefined}
            emptyMessage={
              galleryEmptyMessage ??
              (isEarlyListing
                ? "Mitho has listed this place, but no one has added photos yet. The first visit photos will make this page much more useful."
                : undefined)
            }
            compactEmpty={isEarlyListing}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] items-start">
          <MithoCard surface="customer" interactive="none">
            <MithoCardHeader className="pb-4">
              <MithoCardTitle>Visit essentials</MithoCardTitle>
              <MithoCardDescription className="mt-2 leading-relaxed">
                The practical details most people want before heading out.
              </MithoCardDescription>
            </MithoCardHeader>
            <MithoCardContent className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {visitFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                      {fact.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/72">
                        {fact.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fact.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-brand-dark-green">Amenities people often look for</p>
                <AmenityList amenities={[...visitInfo.amenities]} className="mt-3" />
              </div>
            </MithoCardContent>
          </MithoCard>

          <div className="sticky top-24 space-y-6">
            <MithoCard surface="customer" interactive="none" className="overflow-hidden">
              <MithoCardHeader className="pb-4">
                <MithoCardTitle>Find it easily</MithoCardTitle>
                {visitInfo.mapDescription ? (
                  <MithoCardDescription className="mt-2">{visitInfo.mapDescription}</MithoCardDescription>
                ) : null}
              </MithoCardHeader>
              <MithoCardContent>
                <div className="overflow-hidden rounded-xl border border-border">
                  {staticMapUrl ? (
                    <StaticMap url={staticMapUrl} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#fffdf8] px-6 text-center">
                      <div>
                        <p className="text-sm font-semibold text-brand-dark-green">
                          {visitInfo.coordinates ? "Map preview unavailable" : "Location coordinates not provided"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {visitInfo.coordinates
                            ? "Add the Google Maps API key to render the static location preview here."
                            : "Map preview and directions will appear once latitude and longitude are added."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {directionsUrl ? (
                    <MithoButton variant="outline-secondary" size="default" asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-4 w-4" />
                        {visitInfo.mapLinkText ?? "Get directions"}
                      </a>
                    </MithoButton>
                  ) : null}

                  {websiteUrl ? (
                    <MithoButton variant="ghost" size="default" asChild>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                        Visit website
                      </a>
                    </MithoButton>
                  ) : null}
                </div>
              </MithoCardContent>
            </MithoCard>

            {visitInfo.goodToKnow ? (
              <MithoCard surface="customer" interactive="none" className="bg-[#fffdf8]">
                <MithoCardContent className="p-5">
                  <p className="type-eyebrow text-brand-deep-green/70">Good to know</p>
                  <p className="mt-3 text-lg font-semibold text-brand-dark-green">{visitInfo.goodToKnow}</p>
                </MithoCardContent>
              </MithoCard>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function normalizeExternalUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

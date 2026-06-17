"use client"

import * as React from "react"
import { Facebook, Globe, Instagram, MapPin, Music2, Navigation, Phone, Twitter, UtensilsCrossed, Youtube } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { AmenityList } from "@/components/mitho/mitho-amenity"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle, MithoCardDescription } from "@/components/mitho/mitho-card"
import { BusinessGalleryPreview } from "@/features/business/components/business-gallery-preview"
import { BusinessHoursCard } from "@/features/business/components/business-hours-card"
import { cn } from "@/lib/utils"
import { createGoogleStaticMapUrl, createGoogleDirectionsUrl } from "@/lib/google-maps"
import type { BusinessGalleryItem, BusinessSocialPlatform, BusinessVisitInfo } from "@/features/business/business-detail-types"

const SOCIAL_META: Record<BusinessSocialPlatform, { label: string; icon: LucideIcon }> = {
  facebook: { label: "Facebook", icon: Facebook },
  instagram: { label: "Instagram", icon: Instagram },
  twitter: { label: "Twitter", icon: Twitter },
  youtube: { label: "YouTube", icon: Youtube },
  tiktok: { label: "TikTok", icon: Music2 },
}

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
  const [mapFailed, setMapFailed] = React.useState(false)
  const contactLine = visitInfo.phone || "Contact details not listed yet"
  const socialLinks = visitInfo.socialLinks ?? []
  const cuisineLine = visitInfo.cuisines.length > 0 ? visitInfo.cuisines.join(", ") : "Cuisine details coming soon"
  const staticMapUrl = visitInfo.coordinates ? createGoogleStaticMapUrl(visitInfo.coordinates) : null
  const directionsUrl = visitInfo.coordinates ? createGoogleDirectionsUrl(visitInfo.coordinates) : null
  const websiteUrl = visitInfo.website ? normalizeExternalUrl(visitInfo.website) : null

  React.useEffect(() => {
    setMapFailed(false)
  }, [staticMapUrl])

  const visitFacts = [
    {
      icon: <MapPin className="h-5 w-5 text-brand-orange" />,
      label: "Address",
      content: visitInfo.address,
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

        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2 items-start">
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
                  <p className="text-sm font-semibold text-brand-dark-green">Amenities</p>
                  <AmenityList amenities={[...visitInfo.amenities]} className="mt-3" />
                </div>
              </MithoCardContent>
            </MithoCard>

            <div className="space-y-6">
              <BusinessHoursCard
                hours={visitInfo.hours}
                status={visitInfo.hoursStatus}
                todayDayOfWeek={visitInfo.todayDayOfWeek}
              />

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

          <MithoCard surface="customer" interactive="none" className="overflow-hidden">
            <MithoCardHeader className="pb-4">
              <MithoCardTitle>Find it easily</MithoCardTitle>
              {visitInfo.mapDescription ? (
                <MithoCardDescription className="mt-2">{visitInfo.mapDescription}</MithoCardDescription>
              ) : null}
            </MithoCardHeader>
            <MithoCardContent>
              <div className="overflow-hidden rounded-xl border border-border">
                <StaticMapPreview
                  staticMapUrl={staticMapUrl}
                  hasCoordinates={Boolean(visitInfo.coordinates)}
                  failed={mapFailed}
                  address={visitInfo.address}
                  onError={() => setMapFailed(true)}
                  boxClassName="aspect-[4/3] sm:aspect-[16/9] lg:h-[360px] lg:aspect-auto"
                />
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

              {socialLinks.length > 0 ? (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/72">
                    Follow along
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {socialLinks.map((link) => {
                      const meta = SOCIAL_META[link.platform]
                      const Icon = meta.icon
                      return (
                        <a
                          key={link.platform}
                          href={normalizeExternalUrl(link.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={meta.label}
                          title={meta.label}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange transition-colors hover:bg-brand-orange/20"
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </MithoCardContent>
          </MithoCard>
        </div>
      </div>
    </section>
  )
}

export function StaticMapPreview({
  staticMapUrl,
  hasCoordinates,
  failed,
  address,
  onError,
  boxClassName = "aspect-[4/3]",
}: {
  staticMapUrl: string | null
  hasCoordinates: boolean
  failed: boolean
  address: string
  onError?: () => void
  boxClassName?: string
}) {
  if (staticMapUrl && !failed) {
    return (
      <img
        src={staticMapUrl}
        alt={`Map preview for ${address}`}
        className={cn("w-full object-cover", boxClassName)}
        onError={onError}
      />
    )
  }

  return (
    <div className={cn("flex items-center justify-center bg-[#fffdf8] px-6 text-center", boxClassName)}>
      <div>
        <p className="text-sm font-semibold text-brand-dark-green">
          {hasCoordinates ? "Map preview unavailable" : "Location coordinates not provided"}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {hasCoordinates
            ? "Location preview could not be loaded right now. You can still open directions below."
            : "Map preview and directions will appear once latitude and longitude are added."}
        </p>
      </div>
    </div>
  )
}

function normalizeExternalUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

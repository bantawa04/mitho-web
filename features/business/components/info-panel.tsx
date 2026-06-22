"use client"

import * as React from "react"
import { Facebook, Globe, Instagram, Mail, MapPin, Navigation, Twitter, UtensilsCrossed, Youtube } from "lucide-react"
import { AmenityList } from "@/components/mitho/mitho-amenity"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle, MithoCardDescription } from "@/components/mitho/mitho-card"
import { BusinessGalleryPreview } from "@/features/business/components/business-gallery-preview"
import { BusinessHoursCard } from "@/features/business/components/business-hours-card"
import { cn } from "@/lib/utils"
import { createGoogleStaticMapUrl, createGoogleDirectionsUrl } from "@/lib/google-maps"
import type { BusinessGalleryItem, BusinessSocialPlatform, BusinessVisitInfo } from "@/features/business/business-detail-types"

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z" />
    </svg>
  )
}

const SOCIAL_META: Record<BusinessSocialPlatform, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  facebook: { label: "Facebook", icon: Facebook },
  instagram: { label: "Instagram", icon: Instagram },
  twitter: { label: "Twitter", icon: Twitter },
  youtube: { label: "YouTube", icon: Youtube },
  tiktok: { label: "TikTok", icon: TiktokIcon },
}

interface InfoPanelProps {
  isEarlyListing?: boolean
  galleryItems: BusinessGalleryItem[]
  galleryTotalCount?: number
  galleryEmptyMessage?: string
  visitInfo: BusinessVisitInfo
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "accent"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm leading-tight",
        tone === "accent"
          ? "bg-brand-orange/10 text-brand-orange"
          : "bg-brand-soft-beige/50 text-brand-dark-green",
      )}
    >
      {children}
    </span>
  )
}

function PriceRangeChip({ level }: { level: number }) {
  return (
    <Chip>
      <span className="sr-only">Price range</span>
      <span aria-hidden="true" className="flex gap-0.5 font-semibold tracking-tight">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={step <= level ? "text-brand-dark-green" : "text-brand-deep-green/25"}>
            ₨
          </span>
        ))}
      </span>
    </Chip>
  )
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep-green/72">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export function InfoPanel({
  isEarlyListing = false,
  galleryItems,
  galleryTotalCount,
  galleryEmptyMessage,
  visitInfo,
}: InfoPanelProps) {
  const [mapFailed, setMapFailed] = React.useState(false)
  const socialLinks = visitInfo.socialLinks ?? []
  const addressDetails = visitInfo.addressDetails ?? []
  const signatureItems = visitInfo.signatureItems ?? []
  const mealTypes = visitInfo.mealTypes ?? []
  const staticMapUrl = visitInfo.coordinates ? createGoogleStaticMapUrl(visitInfo.coordinates) : null
  const directionsUrl = visitInfo.coordinates ? createGoogleDirectionsUrl(visitInfo.coordinates) : null
  const websiteUrl = visitInfo.website ? normalizeExternalUrl(visitInfo.website) : null
  const menuUrl = visitInfo.menuUrl ? normalizeExternalUrl(visitInfo.menuUrl) : null

  const hasGlanceFacts = Boolean(
    visitInfo.establishmentType || visitInfo.priceRange || visitInfo.avgCostPerPerson || mealTypes.length > 0,
  )
  const hasContact = Boolean(websiteUrl || menuUrl || visitInfo.email || socialLinks.length > 0)

  React.useEffect(() => {
    setMapFailed(false)
  }, [staticMapUrl])

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
              <MithoCardContent className="space-y-6">
                {hasGlanceFacts ? (
                  <SectionBlock title="At a glance">
                    <div className="flex flex-wrap gap-2">
                      {visitInfo.establishmentType ? <Chip>{visitInfo.establishmentType}</Chip> : null}
                      {visitInfo.priceRange ? <PriceRangeChip level={visitInfo.priceRange} /> : null}
                      {visitInfo.avgCostPerPerson ? (
                        <Chip>{`≈ ₨ ${visitInfo.avgCostPerPerson.toLocaleString("en-IN")} / person`}</Chip>
                      ) : null}
                      {mealTypes.map((meal) => (
                        <Chip key={meal}>{meal}</Chip>
                      ))}
                    </div>
                  </SectionBlock>
                ) : null}

                {signatureItems.length > 0 ? (
                  <SectionBlock title="Known for">
                    <div className="flex flex-wrap gap-2">
                      {signatureItems.map((item) => (
                        <Chip key={item} tone="accent">
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </SectionBlock>
                ) : null}

                <SectionBlock title="Cuisine">
                  {visitInfo.cuisines.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {visitInfo.cuisines.map((cuisine) => (
                        <Chip key={cuisine}>{cuisine}</Chip>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Cuisine details coming soon</p>
                  )}
                </SectionBlock>

                <SectionBlock title="Location">
                  {addressDetails.length > 0 ? (
                    <dl className="space-y-2.5">
                      {addressDetails.map((detail) => (
                        <div key={detail.label} className="grid grid-cols-[96px_1fr] gap-3">
                          <dt className="pt-0.5 text-xs font-medium uppercase tracking-wide text-brand-deep-green/55">
                            {detail.label}
                          </dt>
                          <dd className="text-sm leading-relaxed text-brand-dark-green/90">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{visitInfo.address}</p>
                    </div>
                  )}
                </SectionBlock>

                {visitInfo.amenities.length > 0 ? (
                  <SectionBlock title="Amenities">
                    <AmenityList amenities={[...visitInfo.amenities]} />
                  </SectionBlock>
                ) : null}
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

              {hasContact ? (
                <MithoCard surface="customer" interactive="none">
                  <MithoCardHeader className="pb-3">
                    <MithoCardTitle>Contact &amp; links</MithoCardTitle>
                  </MithoCardHeader>
                  <MithoCardContent className="space-y-1">
                    {websiteUrl ? (
                      <ContactLink href={websiteUrl} icon={<Globe className="h-4 w-4" />} label="Visit website" external />
                    ) : null}
                    {menuUrl ? (
                      <ContactLink href={menuUrl} icon={<UtensilsCrossed className="h-4 w-4" />} label="View menu" external />
                    ) : null}
                    {visitInfo.email ? (
                      <ContactLink
                        href={`mailto:${visitInfo.email}`}
                        icon={<Mail className="h-4 w-4" />}
                        label={visitInfo.email}
                      />
                    ) : null}

                    {socialLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-3">
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
                    ) : null}
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
              {directionsUrl ? (
                <div className="mt-4">
                  <MithoButton variant="outline-secondary" size="default" asChild>
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4" />
                      {visitInfo.mapLinkText ?? "Get directions"}
                    </a>
                  </MithoButton>
                </div>
              ) : null}
            </MithoCardContent>
          </MithoCard>
        </div>
      </div>
    </section>
  )
}

function ContactLink({
  href,
  icon,
  label,
  external = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-brand-dark-green transition-colors hover:bg-brand-soft-beige/40"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </a>
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

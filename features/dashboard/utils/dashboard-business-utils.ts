import type { BusinessLifecycleStatus, ManagedBusiness } from "@/features/dashboard/data/dashboard-business-data"
import type { MyBusinessEntry } from "@/types/business"

export function computeBusinessProfileCompleteness(entry: MyBusinessEntry): number {
  const business = entry.business
  const checks = [
    Boolean(business.name),
    Boolean(business.description),
    Boolean(business.phone),
    Boolean(business.email),
    Boolean(business.logo),
    Boolean(business.banner),
    Boolean(business.photos && business.photos.length > 0),
    Boolean(business.establishmentType),
    Boolean(business.cuisines && business.cuisines.length > 0),
    Boolean(business.area || business.nearestLandmark || business.addressNote),
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function formatBusinessEntryLocation(entry: MyBusinessEntry, fallback = "Nepal"): string {
  const business = entry.business
  const parts: string[] = []

  if (business.area) parts.push(business.area)
  if (business.nearestLandmark) parts.push(`Near ${business.nearestLandmark}`)
  if (business.addressNote) parts.push(business.addressNote)
  if (business.municipality?.name) parts.push(business.municipality.name)
  if (business.district?.name) parts.push(business.district.name)

  return parts.join(", ") || business.province?.name || fallback
}

export function deriveManagedBusinessStatus(entry: MyBusinessEntry): ManagedBusiness["status"] {
  if (entry.claimStatus === "pending") return "claim-pending"
  if (entry.membershipRole) {
    return entry.business.listingStatus === "published" ? "active" : "setup-needed"
  }
  return "setup-needed"
}

export function deriveBusinessLifecycleStatus(entry: MyBusinessEntry): BusinessLifecycleStatus {
  const { ownershipStatus, listingStatus } = entry.business

  if (ownershipStatus === "unclaimed") return "unclaimed"
  if (listingStatus === "suspended") return "temporarily_closed"
  if (listingStatus === "rejected") return "permanently_closed"
  if (listingStatus === "pending_review") return "draft"
  return "active"
}

export function getBusinessLifecyclePresentation(status: BusinessLifecycleStatus) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        tone: "bg-success/12 text-success",
        description:
          "The listing is visible as normal and can keep receiving customer traffic, reviews, and routine updates.",
      }
    case "temporarily_closed":
      return {
        label: "Temporarily closed",
        tone: "bg-brand-soft-beige text-brand-orange",
        description:
          "The listing remains on Mitho but will clearly show that the business is temporarily closed until you reopen it.",
      }
    case "permanently_closed":
      return {
        label: "Permanently closed",
        tone: "bg-muted text-muted-foreground",
        description:
          "The listing stays public as historical place data and is marked permanently closed for customers.",
      }
    case "unclaimed":
      return {
        label: "Unclaimed",
        tone: "bg-brand-deep-green/10 text-brand-deep-green",
        description: "This listing exists publicly but is not actively controlled by an owner account right now.",
      }
    case "archived":
      return {
        label: "Archived",
        tone: "bg-muted text-muted-foreground",
        description: "This workspace is archived internally and should not be treated as an active operating business.",
      }
    case "draft":
      return {
        label: "Draft",
        tone: "bg-muted text-muted-foreground",
        description: "This listing has not been fully published yet and can still change more aggressively.",
      }
    case "suspended":
      return {
        label: "Suspended",
        tone: "bg-muted text-muted-foreground",
        description: "This listing is under platform or policy restriction and should be handled through support/admin review.",
      }
  }
}

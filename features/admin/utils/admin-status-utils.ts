import type { BusinessListingStatus, BusinessOwnershipStatus } from "@/types/business"
import type { CuisineStatus } from "@/types/admin-cuisines"
import type { EstablishmentTypeStatus } from "@/types/admin-establishment-types"

export interface AdminPresentation {
  label: string
  tone: string
}

export function getBusinessListingPresentation(status: BusinessListingStatus, options?: { dark?: boolean }): AdminPresentation {
  const dark = options?.dark ?? false

  switch (status) {
    case "published":
      return {
        label: "Published",
        tone: dark
          ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-100",
      }
    case "pending_review":
      return {
        label: "Pending review",
        tone: dark
          ? "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30"
          : "bg-sky-50 text-sky-700 border-sky-100",
      }
    case "suspended":
      return {
        label: "Suspended",
        tone: dark
          ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
          : "bg-red-50 text-red-700 border-red-100",
      }
    case "rejected":
      return {
        label: "Rejected",
        tone: dark
          ? "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/20 dark:text-stone-400 dark:border-stone-800/30"
          : "bg-stone-100 text-stone-700 border-stone-200",
      }
  }
}

export function getBusinessOwnershipPresentation(status: BusinessOwnershipStatus, options?: { dark?: boolean }): AdminPresentation {
  const dark = options?.dark ?? false

  switch (status) {
    case "claimed":
      return {
        label: "Claimed",
        tone: dark
          ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-100",
      }
    case "claim_under_review":
      return {
        label: "Claim under review",
        tone: dark
          ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
          : "bg-amber-50 text-amber-700 border-amber-100",
      }
    case "unclaimed":
      return {
        label: "Unclaimed",
        tone: dark
          ? "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/20 dark:text-stone-400 dark:border-stone-800/30"
          : "bg-stone-100 text-stone-700 border-stone-200",
      }
  }
}

export function getTaxonomyStatusPresentation(status: CuisineStatus | EstablishmentTypeStatus): AdminPresentation {
  return status === "active"
    ? { label: "Active", tone: "bg-emerald-50 text-emerald-700 border-emerald-100" }
    : { label: "Disabled", tone: "bg-stone-100 text-stone-700 border-stone-200" }
}

export function getOauthProviderPresentation(provider?: string | null): AdminPresentation {
  switch ((provider ?? "").toLowerCase()) {
    case "google":
      return { label: "Google", tone: "bg-sky-50 text-sky-700 border-sky-100" }
    case "apple":
      return { label: "Apple", tone: "bg-stone-100 text-stone-700 border-stone-200" }
    default:
      return { label: "Email", tone: "bg-brand-soft-beige/80 text-brand-dark-green border-brand-deep-green/10" }
  }
}

export function getUserStatusPresentation(status: string): AdminPresentation {
  switch (status) {
    case "invited":
      return { label: "Invited", tone: "bg-amber-50 text-amber-700 border-amber-100" }
    case "active":
      return { label: "Active", tone: "bg-emerald-50 text-emerald-700 border-emerald-100" }
    case "inactive":
      return { label: "Disabled", tone: "bg-stone-100 text-stone-700 border-stone-200" }
    case "banned":
      return { label: "Banned", tone: "bg-stone-100 text-stone-700 border-stone-200" }
    default:
      return { label: status, tone: "bg-stone-100 text-stone-700 border-stone-200" }
  }
}

export function getRoleTypePresentation(isSystem: boolean): AdminPresentation {
  return isSystem
    ? { label: "System", tone: "bg-sky-50 text-sky-700 border-sky-100" }
    : { label: "Custom", tone: "bg-brand-soft-beige/80 text-brand-dark-green border-brand-deep-green/10" }
}

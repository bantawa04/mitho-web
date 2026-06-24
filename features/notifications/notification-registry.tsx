import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Building2,
  CheckCircle2,
  FileCheck2,
  Flag,
  ImageIcon,
  MessageSquare,
  MessageSquareWarning,
  Star,
  UserMinus,
  UserPlus,
} from "lucide-react"
import type { NotificationItem } from "@/types/notifications"

interface NotificationPresentation {
  icon: LucideIcon
  href: (item: NotificationItem) => string
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

const DEFAULT_PRESENTATION: NotificationPresentation = {
  icon: Bell,
  href: () => "#",
}

/**
 * Maps a notification `type` to a lucide icon and a deep-link href.
 * Title and body always come from the server-provided item; this registry only
 * adds presentation (icon) and navigation (href).
 */
const REGISTRY: Record<string, NotificationPresentation> = {
  // --- Admin ---
  "admin.business.submitted": { icon: Building2, href: () => "/admin/businesses" },
  "admin.claim.submitted": { icon: FileCheck2, href: () => "/admin/business-claims" },
  "admin.review.pending_moderation": { icon: MessageSquareWarning, href: () => "/admin/reviews/moderation" },
  "admin.business.reported": { icon: Flag, href: () => "/admin/reported-content" },
  "admin.gallery.pending": { icon: ImageIcon, href: () => "/admin/gallery" },
  "admin.account_deletion.requested": { icon: UserMinus, href: () => "/admin/customers" },

  // --- Business ---
  "business.claim.approved": {
    icon: FileCheck2,
    href: (item) => businessSection(item, "overview"),
  },
  "business.claim.rejected": {
    icon: FileCheck2,
    href: (item) => businessSection(item, "overview"),
  },
  "business.listing.approved": {
    icon: Building2,
    href: (item) => businessSection(item, "overview"),
  },
  "business.listing.rejected": {
    icon: Building2,
    href: (item) => businessSection(item, "overview"),
  },
  "business.review.new_approved": {
    icon: MessageSquare,
    href: (item) => businessSection(item, "reviews"),
  },
  "business.gallery.approved": {
    icon: ImageIcon,
    href: (item) => businessSection(item, "photos"),
  },
  "business.gallery.rejected": {
    icon: ImageIcon,
    href: (item) => businessSection(item, "photos"),
  },

  // --- User ---
  "user.review.approved": { icon: Star, href: () => "/profile/reviews" },
  "user.review.rejected": { icon: Star, href: () => "/profile/reviews" },
  "user.review.replied": { icon: MessageSquare, href: () => "/profile/reviews" },
  "user.followed": {
    icon: UserPlus,
    href: (item) => {
      const username = asString(item.data?.username) ?? asString(item.data?.profile)
      return username ? `/users/${username}` : "/profile/followers"
    },
  },
}

function businessSection(item: NotificationItem, section: string): string {
  if (!item.businessId) return "/dashboard/businesses"
  return `/dashboard/businesses/${item.businessId}/${section}`
}

/** Prefix-based fallback so unknown sub-types still deep-link sensibly. */
function prefixFallback(type: string): NotificationPresentation | null {
  if (type.startsWith("admin.business.report")) return REGISTRY["admin.business.reported"]
  if (type.startsWith("admin.claim")) return REGISTRY["admin.claim.submitted"]
  if (type.startsWith("admin.review")) return REGISTRY["admin.review.pending_moderation"]
  if (type.startsWith("admin.gallery")) return REGISTRY["admin.gallery.pending"]
  if (type.startsWith("admin.account_deletion")) return REGISTRY["admin.account_deletion.requested"]
  if (type.startsWith("admin.business")) return REGISTRY["admin.business.submitted"]
  if (type.startsWith("admin.")) return { icon: Bell, href: () => "/admin/notifications" }

  if (type.startsWith("business.claim") || type.startsWith("business.listing")) {
    return { icon: CheckCircle2, href: (item) => businessSection(item, "overview") }
  }
  if (type.startsWith("business.review")) {
    return { icon: MessageSquare, href: (item) => businessSection(item, "reviews") }
  }
  if (type.startsWith("business.gallery")) {
    return { icon: ImageIcon, href: (item) => businessSection(item, "photos") }
  }
  if (type.startsWith("business.")) {
    return { icon: Building2, href: (item) => businessSection(item, "overview") }
  }

  if (type.startsWith("user.followed")) return REGISTRY["user.followed"]
  if (type.startsWith("user.review")) return { icon: Star, href: () => "/profile/reviews" }
  if (type.startsWith("user.")) return { icon: Bell, href: () => "/notifications" }

  return null
}

export function getNotificationPresentation(item: NotificationItem): NotificationPresentation {
  return REGISTRY[item.type] ?? prefixFallback(item.type) ?? DEFAULT_PRESENTATION
}

export function getNotificationHref(item: NotificationItem): string {
  return getNotificationPresentation(item).href(item)
}

export function getNotificationIcon(item: NotificationItem): LucideIcon {
  return getNotificationPresentation(item).icon
}

export interface AdminQueuePreviewItem {
  id: string
  title: string
  subtitle: string
  meta: string
  href: string
}

export interface AdminActivityItem {
  id: string
  action: string
  target: string
  actor: string
  when: string
}

export interface AdminHealthStat {
  id: string
  label: string
  value: string
  note: string
}

export type AdminBusinessStatus = "Verified" | "Claim request" | "Pending" | "Unclaimed"

export interface AdminBusinessListItem {
  id: string
  name: string
  slug: string
  avatarUrl: string
  location: string
  status: AdminBusinessStatus
  ownershipLabel: string
  updatedAt: string
  href: string
}

export type AdminBusinessLifecycleStatus =
  | "Active"
  | "Temporarily closed"
  | "Permanently closed"
  | "Unclaimed"
  | "Draft"
  | "Suspended"

export interface AdminBusinessReviewPreview {
  id: string
  title: string
  rating: number
  author: string
  submittedAt: string
}

export interface AdminBusinessSignalPreview {
  id: string
  label: string
  detail: string
  when: string
  tone: "info" | "success" | "warning"
}

export interface AdminBusinessDetailItem extends AdminBusinessListItem {
  lifecycleStatus: AdminBusinessLifecycleStatus
  establishmentType: string
  primaryCategory: string
  description: string
  neighborhood: string
  city: string
  fullAddress: string
  phone: string
  email: string
  website: string
  ownerName: string
  ownerEmail: string
  claimStateNote: string
  createdAt: string
  claimedAt: string
  averageRating: number
  reviewCount: number
  profileViews30d: number
  recentReviews: AdminBusinessReviewPreview[]
  recentSignals: AdminBusinessSignalPreview[]
  publicHref: string
  ownerWorkspaceHref: string
}

export type AdminActivityLogScope =
  | "Businesses"
  | "Reviews"
  | "Users"
  | "Roles"
  | "Establishment Types"
  | "Settings"

export interface AdminActivityLogItem {
  id: string
  actorName: string
  actorRole: string
  actionLabel: string
  scope: AdminActivityLogScope
  targetLabel: string
  occurredAt: string
  summary: string
}

export interface AdminNotificationItem {
  id: string
  title: string
  subtitle: string
  when: string
  href: string
  kind: "claim" | "review" | "business"
}

export type AdminCustomerOauthType = "Google" | "Apple"

export interface AdminCustomerItem {
  id: string
  name: string
  email: string
  oauthType: AdminCustomerOauthType
  hasBusiness: boolean
  joinedAt: string
  businessNames: string[]
  reviewsCount: number
  collectionsCount: number
}

export type AdminEstablishmentTypeStatus = "Active" | "Disabled"

export interface AdminEstablishmentTypeItem {
  id: string
  name: string
  status: AdminEstablishmentTypeStatus
  listingsCount: number
  updatedAt: string
}

export type AdminInternalUserStatus = "Invited" | "Active" | "Disabled"
export type AdminRoleType = "System" | "Custom"

export type AdminPermissionResource = "Business" | "Reviews" | "Customer" | "Users" | "Roles" | "Establishment Types"
export type AdminPermissionAction = "Create" | "Read" | "Update" | "Delete"

export interface AdminRolePermissions {
  resources: Record<AdminPermissionResource, Partial<Record<AdminPermissionAction, boolean>>>
  notifications: boolean
}

export interface AdminRoleItem {
  id: string
  name: string
  type: AdminRoleType
  permissions: AdminRolePermissions
}

export interface AdminInternalUserItem {
  id: string
  name: string
  email: string
  roleId: string
  status: AdminInternalUserStatus
  joinedAt: string
  notifyByEmail: boolean
}

export interface AdminSettingsProfile {
  name: string
  email: string
  address: {
    addressLine: string
    area: string
    city: string
    state: string
    country: string
  }
  mobileNumber: string
  notifications: {
    newBusinessSignup: boolean
    claimRequest: boolean
    newReview: boolean
  }
}

export type AdminReviewModerationFlag =
  | "Abusive wording"
  | "Potential duplicate"
  | "Owner dispute"
  | "Off-topic content"
  | "Harassment"

export type AdminReviewModerationStatus = "Pending" | "Accepted" | "Rejected"

export interface AdminReviewModerationItem {
  id: string
  businessName: string
  reviewerName: string
  reviewerAvatarUrl: string
  reviewTitle: string
  rating: number
  reviewSnippet: string
  reviewBody: string
  flagLabel: AdminReviewModerationFlag
  submittedAt: string
  moderationStatus: AdminReviewModerationStatus
}

export interface AdminHomeData {
  pendingClaimsCount: number
  flaggedReviewsCount: number
  reportedContentCount: number
  unresolvedSupportCount: number
  claimQueuePreview: AdminQueuePreviewItem[]
  reviewModerationPreview: AdminQueuePreviewItem[]
  reportedContentPreview: AdminQueuePreviewItem[]
  recentAdminActions: AdminActivityItem[]
  healthStats: AdminHealthStat[]
}

export const mockAdminOperator = {
  name: "Aarati Shrestha",
  avatarUrl: "/woman-portrait.png",
  roleLabel: "Admin operator",
}

export const adminBusinessStatusOptions: Array<"All" | AdminBusinessStatus> = [
  "All",
  "Verified",
  "Claim request",
  "Pending",
  "Unclaimed",
]

export const adminActivityLogScopeOptions: Array<"All" | AdminActivityLogScope> = [
  "All",
  "Businesses",
  "Reviews",
  "Users",
  "Roles",
  "Establishment Types",
  "Settings",
]

export const adminEstablishmentTypeStatusOptions: Array<"All" | AdminEstablishmentTypeStatus> = [
  "All",
  "Active",
  "Disabled",
]

export const adminInternalUserStatusOptions: Array<"All" | AdminInternalUserStatus> = [
  "All",
  "Invited",
  "Active",
  "Disabled",
]

export const adminRoleTypeOptions: Array<"All" | AdminRoleType> = ["All", "System", "Custom"]

export const adminPermissionActions: AdminPermissionAction[] = ["Create", "Read", "Update", "Delete"]

export const adminPermissionMatrix: Array<{
  resource: AdminPermissionResource
  label: string
  actions: AdminPermissionAction[]
}> = [
  {
    resource: "Business",
    label: "Business",
    actions: ["Create", "Read", "Update"],
  },
  {
    resource: "Reviews",
    label: "Reviews",
    actions: ["Create", "Read", "Update", "Delete"],
  },
  {
    resource: "Customer",
    label: "Customer",
    actions: ["Read"],
  },
  {
    resource: "Users",
    label: "Users",
    actions: ["Create", "Read", "Update", "Delete"],
  },
  {
    resource: "Roles",
    label: "Roles",
    actions: ["Create", "Read", "Update", "Delete"],
  },
  {
    resource: "Establishment Types",
    label: "Establishment Types",
    actions: ["Create", "Read", "Update", "Delete"],
  },
]

export const mockAdminNotifications: AdminNotificationItem[] = [
  {
    id: "notification-1",
    title: "New claim request needs review",
    subtitle: "Momo Central submitted a fresh ownership request with business documents.",
    when: "8 min ago",
    href: "/admin/business-claims",
    kind: "claim",
  },
  {
    id: "notification-2",
    title: "Flagged review escalated",
    subtitle: "A business owner disputed a review and attached context for moderation.",
    when: "22 min ago",
    href: "/admin/reviews/moderation",
    kind: "review",
  },
  {
    id: "notification-3",
    title: "Listing still pending verification",
    subtitle: "The Patan Chowk Kitchen is waiting on a final storefront confirmation.",
    when: "Today",
    href: "/admin/businesses",
    kind: "business",
  },
]

export const mockAdminCustomers: AdminCustomerItem[] = [
  {
    id: "customer-1",
    name: "Nabin Karki",
    email: "nabin.karki@gmail.com",
    oauthType: "Google",
    hasBusiness: true,
    joinedAt: "May 20, 2026 · 8:10 PM",
    businessNames: ["Momo Central"],
    reviewsCount: 14,
    collectionsCount: 5,
  },
  {
    id: "customer-2",
    name: "Aarushi Rai",
    email: "aarushi.rai@icloud.com",
    oauthType: "Apple",
    hasBusiness: false,
    joinedAt: "May 19, 2026 · 3:45 PM",
    businessNames: [],
    reviewsCount: 8,
    collectionsCount: 2,
  },
  {
    id: "customer-3",
    name: "Roshan Shrestha",
    email: "roshan.shrestha@gmail.com",
    oauthType: "Google",
    hasBusiness: true,
    joinedAt: "May 18, 2026 · 10:22 AM",
    businessNames: ["Himalayan Java Courtyard", "Roshan Rooftop Grill"],
    reviewsCount: 6,
    collectionsCount: 1,
  },
  {
    id: "customer-4",
    name: "Mina Tamang",
    email: "mina.tamang@icloud.com",
    oauthType: "Apple",
    hasBusiness: false,
    joinedAt: "May 15, 2026 · 7:32 PM",
    businessNames: [],
    reviewsCount: 21,
    collectionsCount: 7,
  },
  {
    id: "customer-5",
    name: "Sujan Maharjan",
    email: "sujan.maharjan@gmail.com",
    oauthType: "Google",
    hasBusiness: false,
    joinedAt: "May 12, 2026 · 9:18 AM",
    businessNames: [],
    reviewsCount: 4,
    collectionsCount: 0,
  },
  {
    id: "customer-6",
    name: "Puja Basnet",
    email: "puja.basnet@icloud.com",
    oauthType: "Apple",
    hasBusiness: true,
    joinedAt: "May 9, 2026 · 1:06 PM",
    businessNames: ["Brick Lane Brunch"],
    reviewsCount: 11,
    collectionsCount: 3,
  },
  {
    id: "customer-7",
    name: "Sanjog Shakya",
    email: "sanjog.shakya@gmail.com",
    oauthType: "Google",
    hasBusiness: false,
    joinedAt: "May 7, 2026 · 6:54 PM",
    businessNames: [],
    reviewsCount: 9,
    collectionsCount: 4,
  },
  {
    id: "customer-8",
    name: "Asmita Gurung",
    email: "asmita.gurung@icloud.com",
    oauthType: "Apple",
    hasBusiness: false,
    joinedAt: "May 4, 2026 · 11:40 AM",
    businessNames: [],
    reviewsCount: 3,
    collectionsCount: 1,
  },
]

export const mockAdminEstablishmentTypes: AdminEstablishmentTypeItem[] = [
  {
    id: "establishment-type-1",
    name: "Restaurant",
    status: "Active",
    listingsCount: 248,
    updatedAt: "May 21, 2026 · 2:10 PM",
  },
  {
    id: "establishment-type-2",
    name: "Cafe",
    status: "Active",
    listingsCount: 132,
    updatedAt: "May 20, 2026 · 11:42 AM",
  },
  {
    id: "establishment-type-3",
    name: "Street Food Stall",
    status: "Active",
    listingsCount: 87,
    updatedAt: "May 20, 2026 · 9:05 AM",
  },
  {
    id: "establishment-type-4",
    name: "Bakery",
    status: "Active",
    listingsCount: 54,
    updatedAt: "May 18, 2026 · 4:30 PM",
  },
  {
    id: "establishment-type-5",
    name: "Food Court Counter",
    status: "Disabled",
    listingsCount: 12,
    updatedAt: "May 17, 2026 · 3:18 PM",
  },
  {
    id: "establishment-type-6",
    name: "Tea House",
    status: "Active",
    listingsCount: 61,
    updatedAt: "May 16, 2026 · 8:22 AM",
  },
  {
    id: "establishment-type-7",
    name: "Dessert Shop",
    status: "Active",
    listingsCount: 39,
    updatedAt: "May 15, 2026 · 12:56 PM",
  },
  {
    id: "establishment-type-8",
    name: "Pop-up Kitchen",
    status: "Disabled",
    listingsCount: 6,
    updatedAt: "May 12, 2026 · 6:15 PM",
  },
]

export const mockAdminRoles: AdminRoleItem[] = [
  {
    id: "role-1",
    name: "Super admin",
    type: "System",
    permissions: {
      resources: {
        Business: { Create: true, Read: true, Update: true },
        Reviews: { Create: true, Read: true, Update: true, Delete: true },
        Customer: { Read: true },
        Users: { Create: true, Read: true, Update: true, Delete: true },
        Roles: { Create: true, Read: true, Update: true, Delete: true },
        "Establishment Types": { Create: true, Read: true, Update: true, Delete: true },
      },
      notifications: true,
    },
  },
  {
    id: "role-2",
    name: "Moderation lead",
    type: "System",
    permissions: {
      resources: {
        Business: { Read: true },
        Reviews: { Create: true, Read: true, Update: true, Delete: true },
        Customer: { Read: true },
        Users: { Read: true },
        Roles: { Read: true },
        "Establishment Types": { Read: true, Update: true },
      },
      notifications: true,
    },
  },
  {
    id: "role-3",
    name: "Business ops",
    type: "Custom",
    permissions: {
      resources: {
        Business: { Create: true, Read: true, Update: true },
        Reviews: { Read: true, Update: true },
        Customer: { Read: true },
        Users: { Read: true },
        Roles: { Read: true },
        "Establishment Types": { Create: true, Read: true, Update: true },
      },
      notifications: true,
    },
  },
  {
    id: "role-4",
    name: "Support coordinator",
    type: "Custom",
    permissions: {
      resources: {
        Business: { Read: true },
        Reviews: { Read: true, Update: true },
        Customer: { Read: true },
        Users: { Read: true },
        Roles: {},
        "Establishment Types": { Read: true },
      },
      notifications: true,
    },
  },
]

export const mockAdminInternalUsers: AdminInternalUserItem[] = [
  {
    id: "admin-user-1",
    name: "Aarati Shrestha",
    email: "aarati.shrestha@mithocha.com",
    roleId: "role-1",
    status: "Active",
    joinedAt: "May 2, 2026 · 9:10 AM",
    notifyByEmail: true,
  },
  {
    id: "admin-user-2",
    name: "Roshan Gurung",
    email: "roshan.gurung@mithocha.com",
    roleId: "role-2",
    status: "Active",
    joinedAt: "May 7, 2026 · 11:32 AM",
    notifyByEmail: true,
  },
  {
    id: "admin-user-3",
    name: "Nima Bista",
    email: "nima.bista@mithocha.com",
    roleId: "role-3",
    status: "Invited",
    joinedAt: "May 18, 2026 · 4:20 PM",
    notifyByEmail: true,
  },
  {
    id: "admin-user-4",
    name: "Sabina Shahi",
    email: "sabina.shahi@mithocha.com",
    roleId: "role-4",
    status: "Disabled",
    joinedAt: "Apr 27, 2026 · 3:05 PM",
    notifyByEmail: false,
  },
]

export const mockAdminSettingsProfile: AdminSettingsProfile = {
  name: "Aarati Shrestha",
  email: "aarati.shrestha@mithocha.com",
  address: {
    addressLine: "Amrit Marg",
    area: "Thamel",
    city: "Kathmandu",
    state: "Bagmati",
    country: "Nepal",
  },
  mobileNumber: "+977 9800000000",
  notifications: {
    newBusinessSignup: true,
    claimRequest: true,
    newReview: true,
  },
}

export const mockAdminReviewModeration: AdminReviewModerationItem[] = [
  {
    id: "review-moderation-1",
    businessName: "The Himalayan Kitchen",
    reviewerName: "Nabin Karki",
    reviewerAvatarUrl: "/nepali-man-portrait.jpg",
    reviewTitle: "Owner started arguing at the table",
    rating: 2,
    reviewSnippet: "Owner started arguing at the table and the whole service felt hostile.",
    reviewBody:
      "The food was decent, but the owner started arguing with our table when we asked about the bill. The tone got personal and it crossed into a really uncomfortable interaction.",
    flagLabel: "Abusive wording",
    submittedAt: "May 21, 2026 · 11:18 AM",
    moderationStatus: "Pending",
  },
  {
    id: "review-moderation-2",
    businessName: "Momo Central",
    reviewerName: "Aarushi Rai",
    reviewerAvatarUrl: "/nepali-woman-smiling-portrait.jpg",
    reviewTitle: "This reads almost identical to another post",
    rating: 4,
    reviewSnippet: "This reads almost identical to another post from the same hour.",
    reviewBody:
      "Great jhol momo and fast service, but this review content appears nearly identical to another submission from the same user cluster and time window.",
    flagLabel: "Potential duplicate",
    submittedAt: "May 21, 2026 · 10:55 AM",
    moderationStatus: "Pending",
  },
  {
    id: "review-moderation-3",
    businessName: "Kathmandu Coffee Lane",
    reviewerName: "Roshan Shrestha",
    reviewerAvatarUrl: "/thoughtful-man-portrait.png",
    reviewTitle: "Review includes false personal accusations",
    rating: 1,
    reviewSnippet: "Business owner says the review includes false personal accusations.",
    reviewBody:
      "The owner claims this review includes details that were never part of the visit and escalated it because it names staff directly while accusing them of behavior they deny.",
    flagLabel: "Owner dispute",
    submittedAt: "May 21, 2026 · 9:30 AM",
    moderationStatus: "Pending",
  },
  {
    id: "review-moderation-4",
    businessName: "Yak & Yeti Bites",
    reviewerName: "Mina Tamang",
    reviewerAvatarUrl: "/middle-aged-woman.png",
    reviewTitle: "Review seems to describe another restaurant",
    rating: 3,
    reviewSnippet: "Most of the text is about another restaurant and doesn’t match this listing.",
    reviewBody:
      "The review mostly talks about a different outlet and references a menu and neighborhood that do not match this business, so it may be off-topic or posted to the wrong listing.",
    flagLabel: "Off-topic content",
    submittedAt: "May 21, 2026 · 8:12 AM",
    moderationStatus: "Pending",
  },
  {
    id: "review-moderation-5",
    businessName: "Thamel Tandoori",
    reviewerName: "Sujan Maharjan",
    reviewerAvatarUrl: "/placeholder-user.jpg",
    reviewTitle: "Reviewer starts insulting staff directly",
    rating: 1,
    reviewSnippet: "The reviewer starts insulting staff directly rather than describing the visit.",
    reviewBody:
      "Instead of focusing on the experience, the review contains direct insults aimed at staff and uses language that looks more like harassment than customer feedback.",
    flagLabel: "Harassment",
    submittedAt: "May 21, 2026 · 7:48 AM",
    moderationStatus: "Pending",
  },
  {
    id: "review-moderation-6",
    businessName: "Brick Lane Brunch",
    reviewerName: "Puja Basnet",
    reviewerAvatarUrl: "/diverse-woman-smiling.png",
    reviewTitle: "Looks copied from a previous review",
    rating: 5,
    reviewSnippet: "Another customer report says this post is copied from a previous review verbatim.",
    reviewBody:
      "The brunch comments are positive, but the structure and wording appear copied from an earlier public review, so it was escalated for a duplication check.",
    flagLabel: "Potential duplicate",
    submittedAt: "May 20, 2026 · 5:40 PM",
    moderationStatus: "Pending",
  },
]

export const mockAdminBusinesses: AdminBusinessListItem[] = [
  { id: "business-1", name: "The Himalayan Kitchen", slug: "the-himalayan-kitchen", avatarUrl: "/nepali-restaurant-traditional-interior.jpg", location: "Thamel, Kathmandu", status: "Verified", ownershipLabel: "Claimed by owner", updatedAt: "Updated 2 hrs ago", href: "/dashboard/businesses/the-himalayan-kitchen/overview" },
  { id: "business-2", name: "Himalayan Java Courtyard", slug: "himalayan-java-courtyard", avatarUrl: "/himalayan-java-coffee-cafe-nepal.jpg", location: "Durbar Marg, Kathmandu", status: "Claim request", ownershipLabel: "Ownership documents uploaded", updatedAt: "Submitted today", href: "/admin/business-claims" },
  { id: "business-3", name: "Momo Central", slug: "momo-central", avatarUrl: "/momos-dumplings.jpg", location: "Patan, Lalitpur", status: "Claim request", ownershipLabel: "Competing ownership request", updatedAt: "Submitted today", href: "/admin/business-claims" },
  { id: "business-4", name: "The Patan Chowk Kitchen", slug: "the-patan-chowk-kitchen", avatarUrl: "/newari-food-platter.jpg", location: "Patan Durbar Square, Lalitpur", status: "Pending", ownershipLabel: "Storefront check required", updatedAt: "Updated yesterday", href: "/admin/businesses" },
  { id: "business-5", name: "Kathmandu Coffee Lane", slug: "kathmandu-coffee-lane", avatarUrl: "/restaurant-interior-cozy.jpg", location: "Baneshwor, Kathmandu", status: "Verified", ownershipLabel: "Claimed by owner", updatedAt: "Updated yesterday", href: "/dashboard/businesses/the-himalayan-kitchen/photos" },
  { id: "business-6", name: "Yak & Yeti Bites", slug: "yak-yeti-bites", avatarUrl: "/restaurant-exterior-storefront.jpg", location: "Jawalakhel, Lalitpur", status: "Verified", ownershipLabel: "Claim approved this week", updatedAt: "Updated today", href: "/admin/businesses" },
  { id: "business-7", name: "Thamel Tandoori", slug: "thamel-tandoori", avatarUrl: "/chef-cooking-nepali-food.jpg", location: "Thamel, Kathmandu", status: "Pending", ownershipLabel: "Manual review queued", updatedAt: "Updated today", href: "/admin/businesses" },
  { id: "business-8", name: "Patan Plates", slug: "patan-plates", avatarUrl: "/placeholder-logo.png", location: "Kupondole, Lalitpur", status: "Unclaimed", ownershipLabel: "No owner linked", updatedAt: "Updated 3 days ago", href: "/admin/businesses" },
  { id: "business-9", name: "Brick Lane Brunch", slug: "brick-lane-brunch", avatarUrl: "/italian-restaurant-interior.png", location: "Jhamsikhel, Lalitpur", status: "Verified", ownershipLabel: "Claimed by owner", updatedAt: "Updated 4 days ago", href: "/admin/businesses" },
  { id: "business-10", name: "Bhaktapur Bricks Cafe", slug: "bhaktapur-bricks-cafe", avatarUrl: "/placeholder-logo.png", location: "Bhaktapur", status: "Unclaimed", ownershipLabel: "Awaiting first claim", updatedAt: "Updated 5 days ago", href: "/admin/businesses" },
  { id: "business-11", name: "Lakeside Momo Map", slug: "lakeside-momo-map", avatarUrl: "/lakeside-cafe-pokhara-nepal.jpg", location: "Pokhara", status: "Pending", ownershipLabel: "Details verification pending", updatedAt: "Updated 5 days ago", href: "/admin/businesses" },
  { id: "business-12", name: "Roshan Rooftop Grill", slug: "roshan-rooftop-grill", avatarUrl: "/bbq-food-truck-smoking.jpg", location: "Boudha, Kathmandu", status: "Claim request", ownershipLabel: "New business claim submitted", updatedAt: "Submitted yesterday", href: "/admin/business-claims" },
]

function statusToLifecycle(status: AdminBusinessStatus): AdminBusinessLifecycleStatus {
  switch (status) {
    case "Verified":
      return "Active"
    case "Claim request":
      return "Unclaimed"
    case "Pending":
      return "Draft"
    case "Unclaimed":
      return "Unclaimed"
  }
}

function categoryFromBusinessName(name: string) {
  if (name.toLowerCase().includes("cafe") || name.toLowerCase().includes("coffee")) return "Cafe"
  if (name.toLowerCase().includes("brunch")) return "Brunch spot"
  if (name.toLowerCase().includes("momo")) return "Momo spot"
  if (name.toLowerCase().includes("bakery")) return "Bakery"
  return "Restaurant"
}

function establishmentTypeFromCategory(category: string) {
  if (category === "Cafe") return "Cafe"
  return "Restaurant"
}

function ownerContextForStatus(status: AdminBusinessStatus) {
  switch (status) {
    case "Verified":
      return {
        ownerName: "Aarati Shrestha",
        ownerEmail: "aarati.shrestha@mithocha.com",
        claimStateNote: "Claim approved and mapped to an active owner workspace.",
      }
    case "Claim request":
      return {
        ownerName: "Pending claimant",
        ownerEmail: "claim-review@mithocha.com",
        claimStateNote: "Ownership documents are waiting on admin review before business access unlocks.",
      }
    case "Pending":
      return {
        ownerName: "Listing in review",
        ownerEmail: "ops@mithocha.com",
        claimStateNote: "The listing still needs a quality and storefront verification pass.",
      }
    case "Unclaimed":
      return {
        ownerName: "No owner linked",
        ownerEmail: "unclaimed@mithocha.com",
        claimStateNote: "This listing is public but not tied to an active owner account.",
      }
  }
}

function buildRecentReviews(name: string): AdminBusinessReviewPreview[] {
  return [
    {
      id: `${name}-review-1`,
      title: `${name} still gets strong weekday traffic`,
      rating: 4,
      author: "Nabin Karki",
      submittedAt: "May 21, 2026 · 11:18 AM",
    },
    {
      id: `${name}-review-2`,
      title: `Guests keep mentioning service clarity at ${name}`,
      rating: 3,
      author: "Aarushi Rai",
      submittedAt: "May 20, 2026 · 6:42 PM",
    },
  ]
}

function buildRecentSignals(business: AdminBusinessListItem): AdminBusinessSignalPreview[] {
  if (business.status === "Claim request") {
    return [
      {
        id: `${business.id}-signal-1`,
        label: "Claim submitted",
        detail: "A claimant uploaded ownership documents and is waiting on verification.",
        when: "Today",
        tone: "warning",
      },
      {
        id: `${business.id}-signal-2`,
        label: "Directory still public",
        detail: "Customers can still find the listing while the request is being reviewed.",
        when: "This week",
        tone: "info",
      },
    ]
  }

  if (business.status === "Pending") {
    return [
      {
        id: `${business.id}-signal-1`,
        label: "Verification pending",
        detail: "Storefront or detail quality still needs an admin pass before the listing is treated as fully healthy.",
        when: "Yesterday",
        tone: "warning",
      },
      {
        id: `${business.id}-signal-2`,
        label: "Listing edits paused",
        detail: "Business-facing quality work is still waiting on the admin review queue.",
        when: "This week",
        tone: "info",
      },
    ]
  }

  return [
    {
      id: `${business.id}-signal-1`,
      label: "Listing healthy",
      detail: "No current claim or trust blockers are preventing normal business access.",
      when: "Today",
      tone: "success",
    },
    {
      id: `${business.id}-signal-2`,
      label: "Recent customer activity",
      detail: "Reviews and profile traffic continue to arrive without unusual moderation flags.",
      when: "This week",
      tone: "info",
    },
  ]
}

export const mockAdminBusinessDetails: AdminBusinessDetailItem[] = mockAdminBusinesses.map((business, index) => {
  const [neighborhood = business.location, city = "Kathmandu"] = business.location.split(",").map((part) => part.trim())
  const category = categoryFromBusinessName(business.name)
  const ownerContext = ownerContextForStatus(business.status)

  return {
    ...business,
    lifecycleStatus: statusToLifecycle(business.status),
    establishmentType: establishmentTypeFromCategory(category),
    primaryCategory: category,
    description:
      business.slug === "the-himalayan-kitchen"
        ? "A warm Himalayan comfort-food listing with strong momo, thali, and dinner traffic in the Thamel neighborhood."
        : `${business.name} is currently represented in the Mitho directory as a ${category.toLowerCase()} serving local discovery traffic.`,
    neighborhood,
    city,
    fullAddress: `${business.location}, Nepal`,
    phone: "+977 9800000000",
    email: `${business.slug}@mithocha.example`,
    website: `https://mithocha.example/business/${business.slug}`,
    ownerName: ownerContext.ownerName,
    ownerEmail: ownerContext.ownerEmail,
    claimStateNote: ownerContext.claimStateNote,
    createdAt: `May ${10 - (index % 4)}, 2026 · 9:00 AM`,
    claimedAt: business.status === "Verified" ? `May ${14 - (index % 5)}, 2026 · 1:40 PM` : "Not yet approved",
    averageRating: business.status === "Unclaimed" ? 4.1 : 4.5,
    reviewCount: 12 + index * 3,
    profileViews30d: 820 + index * 91,
    recentReviews: buildRecentReviews(business.name),
    recentSignals: buildRecentSignals(business),
    publicHref: `/business/${business.slug}`,
    ownerWorkspaceHref: `/dashboard/businesses/${business.slug}/overview`,
  }
})

export function getAdminBusinessDetailBySlug(slug: string) {
  return mockAdminBusinessDetails.find((business) => business.slug === slug) ?? null
}

export const mockAdminActivityLogs: AdminActivityLogItem[] = [
  {
    id: "activity-log-1",
    actorName: "Aarati Shrestha",
    actorRole: "Super admin",
    actionLabel: "Approved business claim",
    scope: "Businesses",
    targetLabel: "Himalayan Java Courtyard",
    occurredAt: "May 21, 2026 · 3:12 PM",
    summary: "Approved the latest ownership request after validating the storefront and VAT documents.",
  },
  {
    id: "activity-log-2",
    actorName: "Roshan Gurung",
    actorRole: "Moderation lead",
    actionLabel: "Rejected flagged review",
    scope: "Reviews",
    targetLabel: "Owner started arguing at the table",
    occurredAt: "May 21, 2026 · 1:48 PM",
    summary: "Rejected the review after confirming abusive language and removed it from the public experience.",
  },
  {
    id: "activity-log-3",
    actorName: "Aarati Shrestha",
    actorRole: "Super admin",
    actionLabel: "Updated internal user role",
    scope: "Users",
    targetLabel: "Sabina Shahi",
    occurredAt: "May 21, 2026 · 11:24 AM",
    summary: "Changed the assigned role from Support coordinator to Moderation lead.",
  },
  {
    id: "activity-log-4",
    actorName: "Roshan Gurung",
    actorRole: "Moderation lead",
    actionLabel: "Edited custom role",
    scope: "Roles",
    targetLabel: "Business ops",
    occurredAt: "May 20, 2026 · 6:16 PM",
    summary: "Added read access for Users and update access for Establishment Types.",
  },
  {
    id: "activity-log-5",
    actorName: "Aarati Shrestha",
    actorRole: "Super admin",
    actionLabel: "Created establishment type",
    scope: "Establishment Types",
    targetLabel: "Dessert Shop",
    occurredAt: "May 20, 2026 · 1:22 PM",
    summary: "Added a new establishment type for dessert-first businesses in the directory.",
  },
  {
    id: "activity-log-6",
    actorName: "Aarati Shrestha",
    actorRole: "Super admin",
    actionLabel: "Updated notification preferences",
    scope: "Settings",
    targetLabel: "Admin account settings",
    occurredAt: "May 19, 2026 · 9:03 AM",
    summary: "Enabled moderation alerts and disabled the daily digest for the current operator profile.",
  },
]

export const mockAdminHomeData: AdminHomeData = {
  pendingClaimsCount: 18,
  flaggedReviewsCount: 26,
  reportedContentCount: 9,
  unresolvedSupportCount: 4,
  claimQueuePreview: [
    {
      id: "claim-1",
      title: "Himalayan Java Courtyard",
      subtitle: "Ownership documents uploaded and ready for verification.",
      meta: "Submitted 2 hours ago by roshanroutes",
      href: "/admin/business-claims",
    },
    {
      id: "claim-2",
      title: "Momo Central",
      subtitle: "Existing listing has one competing ownership request.",
      meta: "Submitted today by nabin-eats",
      href: "/admin/business-claims",
    },
    {
      id: "claim-3",
      title: "The Patan Chowk Kitchen",
      subtitle: "VAT document is clear but storefront photo needs a quick check.",
      meta: "Submitted yesterday by patanplates",
      href: "/admin/business-claims",
    },
  ],
  reviewModerationPreview: [
    {
      id: "review-1",
      title: "2-star review flagged for abusive wording",
      subtitle: "Himalayan Flavors review mentions owner directly and needs a policy pass.",
      meta: "Flagged 28 minutes ago",
      href: "/admin/reviews/moderation",
    },
    {
      id: "review-2",
      title: "Duplicate review suspected",
      subtitle: "Two near-identical posts landed for the same business within 6 minutes.",
      meta: "Flagged 1 hour ago",
      href: "/admin/reviews/moderation",
    },
    {
      id: "review-3",
      title: "Reply escalation from business owner",
      subtitle: "Owner disputed a review and attached reply context for admin review.",
      meta: "Needs response today",
      href: "/admin/reviews/moderation",
    },
  ],
  reportedContentPreview: [
    {
      id: "report-1",
      title: "Customer photo reported as unrelated",
      subtitle: "Photo appears to show a different location than the listed business.",
      meta: "Reported today",
      href: "/admin/reported-content",
    },
    {
      id: "report-2",
      title: "Creator collection reported for misleading title",
      subtitle: "Public collection headline may overstate halal availability.",
      meta: "Reported yesterday",
      href: "/admin/reported-content",
    },
    {
      id: "report-3",
      title: "Business listing detail mismatch",
      subtitle: "Phone number and neighborhood have been disputed by multiple users.",
      meta: "3 open reports",
      href: "/admin/reported-content",
    },
  ],
  recentAdminActions: [
    {
      id: "activity-1",
      action: "Approved business claim",
      target: "Yak & Yeti Bites",
      actor: "Aarati Shrestha",
      when: "18 min ago",
    },
    {
      id: "activity-2",
      action: "Removed flagged review",
      target: "Momo Central",
      actor: "Aarati Shrestha",
      when: "52 min ago",
    },
    {
      id: "activity-3",
      action: "Resolved reported photo",
      target: "Kathmandu Coffee Lane",
      actor: "Aarati Shrestha",
      when: "2 hrs ago",
    },
    {
      id: "activity-4",
      action: "Rejected duplicate ownership request",
      target: "Thamel Tandoori",
      actor: "Aarati Shrestha",
      when: "Today",
    },
  ],
  healthStats: [
    {
      id: "health-1",
      label: "Claims approved this week",
      value: "11",
      note: "3 still waiting on document quality",
    },
    {
      id: "health-2",
      label: "Reviews posted today",
      value: "84",
      note: "7 currently flagged for moderation",
    },
    {
      id: "health-3",
      label: "Active reports",
      value: "19",
      note: "Most are photo and listing-detail disputes",
    },
  ],
}

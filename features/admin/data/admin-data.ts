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

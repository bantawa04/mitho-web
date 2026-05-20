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

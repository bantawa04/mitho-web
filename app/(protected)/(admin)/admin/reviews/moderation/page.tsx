import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminReviewModerationPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Review moderation"
      title="Handle flagged reviews and keep public trust signals usable."
      description="This queue will later host abuse checks, duplicate detection, owner escalations, and policy-based moderation decisions for review content."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="reviews"
    />
  )
}

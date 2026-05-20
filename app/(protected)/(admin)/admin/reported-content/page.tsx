import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminReportedContentPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Reported content"
      title="Triage the photos, listings, and creator content users have disputed."
      description="This route will later support content reports, listing mismatch review, creator collection disputes, and resolution actions with operator notes."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="reports"
    />
  )
}

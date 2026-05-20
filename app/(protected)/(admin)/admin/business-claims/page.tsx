import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminBusinessClaimsPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Business claims"
      title="Review ownership requests before business access is unlocked."
      description="This queue will eventually hold claim documents, storefront checks, duplicate request conflicts, and approve/reject actions for operators."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="claims"
    />
  )
}

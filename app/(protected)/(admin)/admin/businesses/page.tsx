import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminBusinessesPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Businesses"
      title="Search, inspect, and intervene on public business listings."
      description="This future admin page will gather listing lookups, ownership state, public health, and intervention tools in one place."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="businesses"
    />
  )
}

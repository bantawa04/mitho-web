import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminUsersPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Users"
      title="Manage internal staff and admin access without mixing it into customer operations."
      description="This future page will support internal user lookup, admin roles, workspace access, and staff-level intervention tools for Mitho operators."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="users"
    />
  )
}

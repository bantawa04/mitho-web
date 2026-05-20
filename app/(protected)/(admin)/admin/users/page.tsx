import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminUsersPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Users"
      title="Review customer and creator accounts without leaving the admin workspace."
      description="This future page will support user lookup, profile moderation context, follow/report history, and account intervention actions when needed."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="users"
    />
  )
}

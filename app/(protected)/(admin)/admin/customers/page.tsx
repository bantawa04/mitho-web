import { AdminPlaceholderPage } from "@/components/admin/admin-pages"

export default function AdminCustomersPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Customers"
      title="Look up customer and reviewer accounts without mixing them into internal user management."
      description="This surface will later support end-user lookup, review context, report history, and customer-facing moderation touchpoints from one admin directory."
      href="/admin"
      ctaLabel="Back to admin home"
      icon="customers"
    />
  )
}

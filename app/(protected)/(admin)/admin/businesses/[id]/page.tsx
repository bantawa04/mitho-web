import { notFound } from "next/navigation"
import { getAdminBusinessDetailBySlug } from "@/features/admin/data/admin-data"
import { AdminBusinessDetailPage as AdminBusinessDetailScreen } from "@/features/admin/screens/admin-business-detail-page"

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const business = getAdminBusinessDetailBySlug(id)

  if (!business) notFound()

  return <AdminBusinessDetailScreen business={business} />
}

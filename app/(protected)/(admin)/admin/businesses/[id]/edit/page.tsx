import { notFound } from "next/navigation"
import { getAdminBusinessDetailBySlug } from "@/features/admin/data/admin-data"
import { AdminBusinessEditPage as AdminBusinessEditScreen } from "@/features/admin/screens/admin-business-edit-page"

export default async function AdminBusinessEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const business = getAdminBusinessDetailBySlug(id)

  if (!business) notFound()

  return <AdminBusinessEditScreen business={business} />
}

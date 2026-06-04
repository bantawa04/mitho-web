import { AdminBusinessDetailPage as AdminBusinessDetailScreen } from "@/features/admin/screens/admin-business-detail-page"

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminBusinessDetailScreen id={id} />
}


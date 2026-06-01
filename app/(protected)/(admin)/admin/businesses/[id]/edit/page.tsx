import { AdminBusinessFormPage } from "@/features/admin/screens/admin-business-form-page"

export default async function AdminBusinessEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminBusinessFormPage mode="edit" businessId={id} />
}

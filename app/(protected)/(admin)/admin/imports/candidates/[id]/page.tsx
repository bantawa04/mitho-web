import { AdminPlaceImportCandidatePage } from "@/features/admin/screens/admin-place-import-candidate-page"

export default async function AdminImportCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminPlaceImportCandidatePage id={id} />
}

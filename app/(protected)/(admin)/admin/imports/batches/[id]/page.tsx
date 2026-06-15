import { AdminPlaceImportBatchPage } from "@/features/admin/screens/admin-place-import-batch-page"

export default async function AdminImportBatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminPlaceImportBatchPage id={id} />
}

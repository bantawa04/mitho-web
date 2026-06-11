import { CollectionDetailPage } from "@/features/collections/screens/collection-pages"

export default async function CollectionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CollectionDetailPage id={id} />
}

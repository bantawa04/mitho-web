import { CollectionEditPage } from "@/features/collections/screens/collection-pages"

export default async function CollectionEditRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CollectionEditPage id={id} />
}

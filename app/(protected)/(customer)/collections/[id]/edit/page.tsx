import { notFound } from "next/navigation"
import { getCollectionById } from "@/features/collections/data/collection-data"
import { CollectionEditPage } from "@/features/collections/screens/collection-pages"

export default async function CollectionEditRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const collection = getCollectionById(id)

  if (!collection) {
    notFound()
  }

  return <CollectionEditPage collection={collection} />
}

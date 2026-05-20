import { notFound } from "next/navigation"
import { getCollectionById } from "@/components/collections/collection-data"
import { CollectionEditPage } from "@/components/collections/collection-pages"

export default async function CollectionEditRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const collection = getCollectionById(id)

  if (!collection) {
    notFound()
  }

  return <CollectionEditPage collection={collection} />
}

import { notFound } from "next/navigation"
import { getCollectionById, getPublicCollectionByUsernameAndId } from "@/components/collections/collection-data"
import { CollectionCopyPage } from "@/components/collections/collection-pages"

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CollectionCopyRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const sourceUser = readValue(resolvedSearchParams.sourceUser)

  const sourceCollection =
    (sourceUser ? getPublicCollectionByUsernameAndId(sourceUser, id) : null) ?? getCollectionById(id)

  if (!sourceCollection) {
    notFound()
  }

  return <CollectionCopyPage sourceCollection={sourceCollection} />
}

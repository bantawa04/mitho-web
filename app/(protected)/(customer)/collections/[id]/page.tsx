import { notFound } from "next/navigation"
import { buildCopiedCollection, buildDraftCollection, getCollectionById, getPublicCollectionByUsernameAndId } from "@/features/collections/data/collection-data"
import { CollectionDetailPage } from "@/features/collections/screens/collection-pages"

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CollectionDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams

  const draft = readValue(resolvedSearchParams.draft)
  const title = readValue(resolvedSearchParams.title)
  const description = readValue(resolvedSearchParams.description)
  const visibility = readValue(resolvedSearchParams.visibility)
  const copiedFromUser = readValue(resolvedSearchParams.copiedFromUser)
  const copiedFromCollectionId = readValue(resolvedSearchParams.copiedFromCollectionId)

  let collection = getCollectionById(id)

  if (!collection && draft === "1" && title && (visibility === "private" || visibility === "public")) {
    collection = buildDraftCollection({
      id,
      title,
      description,
      visibility,
    })
  }

  if (!collection && id.endsWith("-copy") && copiedFromUser && copiedFromCollectionId) {
    const source = getPublicCollectionByUsernameAndId(copiedFromUser, copiedFromCollectionId)
    if (source) {
      collection = buildCopiedCollection(source)
    }
  }

  if (!collection) {
    notFound()
  }

  return <CollectionDetailPage collection={collection} />
}

import type { CollectionCandidate, CollectionRecord } from "@/types/collections"
import { getMediaImage } from "@/lib/media-image"

export function getCollectionCoverImages(collection: CollectionRecord) {
  if (collection.coverImages.length > 0) {
    return collection.coverImages
      .map((item) => getMediaImage(item, "card", item.publicUrl))
      .filter((value): value is string => Boolean(value))
  }
  return collection.items
    .map((item) => getMediaImage(item.business?.image, "card", item.business?.image?.publicUrl))
    .filter((value): value is string => Boolean(value))
}

export function getCollectionPlaceCount(collection: CollectionRecord) {
  return collection.itemCount
}

export function searchOwnedCollections(collections: CollectionRecord[], query: string) {
  const normalized = query.trim().toLowerCase()
  return normalized
    ? collections.filter((collection) =>
        [collection.title, collection.description ?? "", collection.provenance?.copiedFromUsername ?? ""].some((value) =>
          value.toLowerCase().includes(normalized),
        ),
      )
    : collections
}

export function createCollectionId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

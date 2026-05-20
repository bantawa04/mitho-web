import { ownedCollections } from "@/components/collections/collection-data"
import { CollectionsIndexPage } from "@/components/collections/collection-pages"

export default function CollectionsRoute() {
  return <CollectionsIndexPage collections={ownedCollections} />
}

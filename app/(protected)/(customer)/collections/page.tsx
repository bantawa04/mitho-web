import { ownedCollections } from "@/features/collections/data/collection-data"
import { CollectionsIndexPage } from "@/features/collections/screens/collection-pages"

export default function CollectionsRoute() {
  return <CollectionsIndexPage collections={ownedCollections} />
}

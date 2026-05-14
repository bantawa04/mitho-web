import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { getPublicCollectionByUsernameAndId } from "@/components/collections/collection-data"
import { CollectionDetailPage } from "@/components/collections/collection-pages"

export default async function PublicCollectionRoute({
  params,
}: {
  params: Promise<{ username: string; id: string }>
}) {
  const { username, id } = await params
  const collection = getPublicCollectionByUsernameAndId(username, id)

  if (!collection) {
    return (
      <div className="page-shell-customer min-h-screen">
        <Header />
        <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-6 py-8 shadow-[0_12px_30px_rgba(10,70,53,0.05)] sm:px-8">
              <h1 className="type-page-title text-brand-dark-green">This public collection is not available.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                The collection might be private now, or the link may no longer point to an active public list.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">
        <CollectionDetailPage
          collection={collection}
          isOwner={false}
          publicSourceHref={`/users/${collection.owner.username}/collections/${collection.id}`}
        />
      </main>
      <Footer />
    </div>
  )
}

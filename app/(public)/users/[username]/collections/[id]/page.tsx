import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicCollectionDetailPage } from "@/features/collections/screens/collection-pages"

export default async function PublicCollectionRoute({
  params,
}: {
  params: Promise<{ username: string; id: string }>
}) {
  const { username, id } = await params

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicCollectionDetailPage username={username} id={id} />
      </main>
      <Footer />
    </div>
  )
}

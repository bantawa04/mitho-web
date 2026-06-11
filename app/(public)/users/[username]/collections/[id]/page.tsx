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
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20">
        <PublicCollectionDetailPage username={username} id={id} />
      </main>
      <Footer />
    </div>
  )
}

import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicFollowersPage } from "@/features/profile/screens/profile-pages"

export default async function PublicUserFollowersRoute({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicFollowersPage username={username} />
      </main>
      <Footer />
    </div>
  )
}

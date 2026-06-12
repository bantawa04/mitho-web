import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { PublicUserProfilePage } from "@/features/profile/screens/profile-pages"

export default async function PublicUserProfileRoute({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-background pb-20">
        <PublicUserProfilePage username={username} />
      </main>
      <Footer />
    </div>
  )
}

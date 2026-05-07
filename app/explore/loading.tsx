import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExploreLoading() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf5e8_34%,#fffdf9_100%)] pb-16">
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white/78 p-5 shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="mt-4 h-12 w-full max-w-2xl rounded-2xl" />
            <Skeleton className="mt-3 h-5 w-full max-w-3xl" />

            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>

            <div className="mt-5 hidden gap-3 lg:flex">
              <Skeleton className="h-11 w-28 rounded-full" />
              <Skeleton className="h-11 w-44 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
              <Skeleton className="h-11 w-44 rounded-full" />
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(10,70,53,0.05)]">
            <Skeleton className="h-6 w-56 rounded-full" />
            <Skeleton className="mt-3 h-5 w-full max-w-4xl" />
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-28 rounded-full" />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.06)] md:grid-cols-[240px_minmax(0,1fr)]"
              >
                <Skeleton className="aspect-[4/3] rounded-none md:h-full" />
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-52" />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Skeleton className="h-28 rounded-[1.35rem]" />
                    <Skeleton className="h-28 rounded-[1.35rem]" />
                  </div>
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

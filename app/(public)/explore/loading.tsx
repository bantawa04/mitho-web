import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExploreLoading() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-background pb-20">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <Skeleton className="h-4 w-40 rounded-full" />

          <div className="mt-8 flex flex-col items-center text-center">
            <Skeleton className="h-9 w-72 rounded-full" />
            <Skeleton className="mt-3 h-5 w-80 rounded-full" />
            <Skeleton className="mt-8 h-[64px] w-full max-w-2xl rounded-full" />
            <div className="mt-5 flex lg:hidden">
              <Skeleton className="h-11 w-28 rounded-full" />
            </div>
          </div>

          <section className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="space-y-6 rounded-xl border border-border bg-white px-5 py-6 shadow-sm">
                <div>
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <div className="mt-3 space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-9 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <div className="mt-3 space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-9 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
                    <Skeleton className="aspect-[4/3] rounded-none md:h-full" />
                    <div className="space-y-4 p-4 sm:p-5">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-lg" />
                        <Skeleton className="h-6 w-24 rounded-lg" />
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
